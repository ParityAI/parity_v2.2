-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'viewer');
CREATE TYPE public.model_status AS ENUM ('approved', 'restricted', 'pending', 'blocked');
CREATE TYPE public.incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.incident_status AS ENUM ('open', 'investigating', 'mitigated', 'closed');
CREATE TYPE public.risk_level AS ENUM ('high', 'medium', 'low');

-- Organizations table
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Profiles table (user profiles linked to auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  security_assessment BOOLEAN DEFAULT false,
  contact_email TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Models table
CREATE TABLE public.models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  provider TEXT,
  version TEXT,
  description TEXT,
  status model_status NOT NULL DEFAULT 'pending',
  risk_level risk_level DEFAULT 'medium',
  security_assessment BOOLEAN DEFAULT false,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance frameworks table
CREATE TABLE public.compliance_frameworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance assessments (per model per framework)
CREATE TABLE public.compliance_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES public.models(id) ON DELETE CASCADE,
  framework_id UUID REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  score INTEGER CHECK (score >= 0 AND score <= 100),
  notes TEXT,
  assessed_by UUID,
  assessed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (model_id, framework_id)
);

-- Incidents table
CREATE TABLE public.incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity incident_severity NOT NULL DEFAULT 'medium',
  status incident_status NOT NULL DEFAULT 'open',
  investigation_notes TEXT,
  resolution_notes TEXT,
  reported_by UUID,
  assigned_to UUID,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's organization
CREATE OR REPLACE FUNCTION public.get_user_organization_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id
  FROM public.profiles
  WHERE user_id = _user_id
$$;

-- RLS Policies

-- Organizations: Users can view their own organization
CREATE POLICY "Users can view their organization"
  ON public.organizations FOR SELECT
  USING (id = public.get_user_organization_id(auth.uid()));

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- User roles: Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

-- Vendors: Users can CRUD vendors in their organization
CREATE POLICY "Users can view organization vendors"
  ON public.vendors FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert organization vendors"
  ON public.vendors FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update organization vendors"
  ON public.vendors FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete organization vendors"
  ON public.vendors FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Models: Users can CRUD models in their organization
CREATE POLICY "Users can view organization models"
  ON public.models FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert organization models"
  ON public.models FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update organization models"
  ON public.models FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete organization models"
  ON public.models FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Compliance frameworks: Everyone can view active frameworks
CREATE POLICY "Anyone can view active frameworks"
  ON public.compliance_frameworks FOR SELECT
  USING (is_active = true);

-- Compliance assessments: Users can CRUD assessments in their organization
CREATE POLICY "Users can view organization assessments"
  ON public.compliance_assessments FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert organization assessments"
  ON public.compliance_assessments FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update organization assessments"
  ON public.compliance_assessments FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Incidents: Users can CRUD incidents in their organization
CREATE POLICY "Users can view organization incidents"
  ON public.incidents FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert organization incidents"
  ON public.incidents FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update organization incidents"
  ON public.incidents FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can delete organization incidents"
  ON public.incidents FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Audit logs: Users can view logs in their organization
CREATE POLICY "Users can view organization audit logs"
  ON public.audit_logs FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON public.models
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_assessments_updated_at
  BEFORE UPDATE ON public.compliance_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample compliance frameworks
INSERT INTO public.compliance_frameworks (name, short_name, region, description) VALUES
  ('NYC Local Law 144', 'NYC LL144', 'USA', 'Automated employment decision tools compliance for New York City'),
  ('EU AI Act', 'EU AI Act', 'Europe', 'European Union Artificial Intelligence Act for high-risk AI systems'),
  ('Colorado AI Act', 'CO AI Act', 'USA', 'Colorado consumer protection requirements for automated decisions'),
  ('Illinois AI Video Interview Act', 'IL AIVOIA', 'USA', 'Illinois requirements for AI analysis of video interviews'),
  ('ISO 42001', 'ISO 42001', 'Global', 'International standard for AI management systems'),
  ('NIST AI Risk Management Framework', 'NIST AI RMF', 'Global', 'Risk management framework for trustworthy AI');

-- Create a demo organization and sample data for testing
INSERT INTO public.organizations (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Demo Organization');

INSERT INTO public.vendors (organization_id, name, description, risk_score, security_assessment) VALUES
  ('00000000-0000-0000-0000-000000000001', 'HireAI Corp', 'Resume screening and candidate matching', 35, true),
  ('00000000-0000-0000-0000-000000000001', 'TalentScore Inc', 'Predictive hiring analytics', 60, false),
  ('00000000-0000-0000-0000-000000000001', 'ResumeBot', 'AI-powered resume parsing', 25, true);

INSERT INTO public.models (organization_id, name, provider, version, status, risk_level, security_assessment) VALUES
  ('00000000-0000-0000-0000-000000000001', 'HireScore', 'HireAI Corp', 'v2.3', 'approved', 'low', true),
  ('00000000-0000-0000-0000-000000000001', 'CandidateRank', 'TalentScore Inc', 'v1.8', 'pending', 'medium', false),
  ('00000000-0000-0000-0000-000000000001', 'ResumeParser', 'ResumeBot', 'v3.1', 'approved', 'low', true),
  ('00000000-0000-0000-0000-000000000001', 'InterviewAnalyzer', 'TalentScore Inc', 'v2.0', 'restricted', 'high', true);

INSERT INTO public.incidents (organization_id, title, description, severity, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Bias detected in candidate scoring', 'Adverse impact ratio below 0.8 for age group 50+', 'critical', 'investigating'),
  ('00000000-0000-0000-0000-000000000001', 'Model version mismatch', 'Production model differs from audit documentation', 'medium', 'open'),
  ('00000000-0000-0000-0000-000000000001', 'Vendor security certification expired', 'TalentScore SOC2 certification expired', 'high', 'open');