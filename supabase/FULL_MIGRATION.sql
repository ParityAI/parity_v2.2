-- ============================================================
-- PARITY AI - COMPLETE DATABASE SETUP
-- Run this ONCE in your new Supabase project SQL Editor
-- ============================================================

-- ============================================================
-- PART 1: Core tables, enums, RLS, and seed data
-- ============================================================

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

-- User roles table
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

-- Compliance assessments
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

CREATE POLICY "Users can view their organization"
  ON public.organizations FOR SELECT
  USING (id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

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

CREATE POLICY "Anyone can view active frameworks"
  ON public.compliance_frameworks FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can view organization assessments"
  ON public.compliance_assessments FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can insert organization assessments"
  ON public.compliance_assessments FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));

CREATE POLICY "Users can update organization assessments"
  ON public.compliance_assessments FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

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

-- Insert compliance frameworks
INSERT INTO public.compliance_frameworks (name, short_name, region, description) VALUES
  ('NYC Local Law 144', 'NYC LL144', 'USA', 'Automated employment decision tools compliance for New York City'),
  ('EU AI Act', 'EU AI Act', 'Europe', 'European Union Artificial Intelligence Act for high-risk AI systems'),
  ('Colorado AI Act', 'CO AI Act', 'USA', 'Colorado consumer protection requirements for automated decisions'),
  ('Illinois AI Video Interview Act', 'IL AIVOIA', 'USA', 'Illinois requirements for AI analysis of video interviews'),
  ('ISO 42001', 'ISO 42001', 'Global', 'International standard for AI management systems'),
  ('NIST AI Risk Management Framework', 'NIST AI RMF', 'Global', 'Risk management framework for trustworthy AI');

-- Create demo organization and sample data
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


-- ============================================================
-- PART 2: Compliance assessment extras + framework checklists
-- ============================================================

ALTER TABLE public.compliance_assessments
ADD COLUMN IF NOT EXISTS deadline timestamp with time zone,
ADD COLUMN IF NOT EXISTS checklist_progress jsonb DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS public.framework_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id uuid REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE NOT NULL,
  item_text text NOT NULL,
  category text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.framework_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view framework checklists"
ON public.framework_checklists
FOR SELECT
USING (true);

-- Insert checklist items using dynamic lookups (not hardcoded UUIDs)
INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order)
SELECT cf.id, item.item_text, item.category, item.sort_order
FROM public.compliance_frameworks cf
CROSS JOIN (VALUES
  ('Conduct annual bias audit by independent auditor', 'Audit', 1),
  ('Publish bias audit results on company website', 'Disclosure', 2),
  ('Provide 10 business days notice to candidates', 'Notice', 3),
  ('Disclose AEDT use in job postings', 'Notice', 4),
  ('Allow candidates to request alternative selection process', 'Candidate Rights', 5),
  ('Calculate impact ratios for sex, race/ethnicity categories', 'Analysis', 6),
  ('Document data sources and selection criteria', 'Documentation', 7)
) AS item(item_text, category, sort_order)
WHERE cf.short_name = 'NYC LL144';

INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order)
SELECT cf.id, item.item_text, item.category, item.sort_order
FROM public.compliance_frameworks cf
CROSS JOIN (VALUES
  ('Classify AI system risk level (minimal/limited/high/unacceptable)', 'Classification', 1),
  ('Register high-risk AI systems in EU database', 'Registration', 2),
  ('Implement risk management system', 'Risk Management', 3),
  ('Ensure data governance and quality measures', 'Data Governance', 4),
  ('Maintain technical documentation', 'Documentation', 5),
  ('Enable logging and record-keeping', 'Monitoring', 6),
  ('Provide transparency to users', 'Transparency', 7),
  ('Ensure human oversight capabilities', 'Oversight', 8),
  ('Conduct conformity assessment', 'Assessment', 9)
) AS item(item_text, category, sort_order)
WHERE cf.short_name = 'EU AI Act';

INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order)
SELECT cf.id, item.item_text, item.category, item.sort_order
FROM public.compliance_frameworks cf
CROSS JOIN (VALUES
  ('Complete impact assessment for high-risk AI systems', 'Assessment', 1),
  ('Disclose AI use to consumers', 'Disclosure', 2),
  ('Provide explanation of AI decision factors', 'Transparency', 3),
  ('Enable consumer appeal process', 'Consumer Rights', 4),
  ('Maintain documentation of AI system purpose', 'Documentation', 5)
) AS item(item_text, category, sort_order)
WHERE cf.short_name = 'CO AI Act';

INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order)
SELECT cf.id, item.item_text, item.category, item.sort_order
FROM public.compliance_frameworks cf
CROSS JOIN (VALUES
  ('Obtain consent before AI video analysis', 'Consent', 1),
  ('Explain AI evaluation criteria to applicants', 'Disclosure', 2),
  ('Limit video sharing to necessary personnel', 'Data Protection', 3),
  ('Delete videos within 30 days upon request', 'Data Retention', 4),
  ('Report demographic data to state annually', 'Reporting', 5)
) AS item(item_text, category, sort_order)
WHERE cf.short_name = 'IL AIVOIA';

INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order)
SELECT cf.id, item.item_text, item.category, item.sort_order
FROM public.compliance_frameworks cf
CROSS JOIN (VALUES
  ('Establish AI management system scope', 'Governance', 1),
  ('Define AI policy and objectives', 'Policy', 2),
  ('Conduct AI risk assessment', 'Risk Management', 3),
  ('Implement AI controls and safeguards', 'Controls', 4),
  ('Monitor and measure AI performance', 'Monitoring', 5),
  ('Conduct internal audits', 'Audit', 6),
  ('Management review of AI systems', 'Review', 7),
  ('Continuous improvement process', 'Improvement', 8)
) AS item(item_text, category, sort_order)
WHERE cf.short_name = 'ISO 42001';

INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order)
SELECT cf.id, item.item_text, item.category, item.sort_order
FROM public.compliance_frameworks cf
CROSS JOIN (VALUES
  ('Map AI system context and stakeholders', 'Govern', 1),
  ('Establish governance structure', 'Govern', 2),
  ('Identify and categorize AI risks', 'Map', 3),
  ('Analyze potential impacts', 'Map', 4),
  ('Measure and assess risks', 'Measure', 5),
  ('Track identified risks', 'Measure', 6),
  ('Implement risk response strategies', 'Manage', 7),
  ('Monitor effectiveness of controls', 'Manage', 8)
) AS item(item_text, category, sort_order)
WHERE cf.short_name = 'NIST AI RMF';


-- ============================================================
-- PART 3: Enable realtime
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.models;
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.compliance_assessments;


-- ============================================================
-- PART 4: Tasks, Risks, Evidence, Policies, Notifications, etc.
-- ============================================================

CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'completed');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.risk_severity AS ENUM ('negligible', 'minor', 'moderate', 'major', 'critical');
CREATE TYPE public.risk_likelihood AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');
CREATE TYPE public.mitigation_status AS ENUM ('not_started', 'in_progress', 'completed', 'accepted');
CREATE TYPE public.policy_status AS ENUM ('draft', 'under_review', 'published', 'archived');
CREATE TYPE public.evidence_type AS ENUM ('document', 'screenshot', 'audit_report', 'certification', 'test_result', 'other');
CREATE TYPE public.notification_type AS ENUM ('task_assigned', 'deadline_approaching', 'incident_reported', 'assessment_required', 'policy_updated', 'system');

CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',
  category TEXT,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_date DATE,
  model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.risks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  severity risk_severity NOT NULL DEFAULT 'moderate',
  likelihood risk_likelihood NOT NULL DEFAULT 'medium',
  impact TEXT,
  mitigation_status mitigation_status NOT NULL DEFAULT 'not_started',
  mitigation_plan TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  identified_date DATE DEFAULT CURRENT_DATE,
  review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.evidence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  evidence_type evidence_type NOT NULL DEFAULT 'document',
  category TEXT,
  model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  assessment_id UUID REFERENCES public.compliance_assessments(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.policies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category TEXT,
  version TEXT DEFAULT '1.0',
  status policy_status NOT NULL DEFAULT 'draft',
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  effective_date DATE,
  review_date DATE,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT false,
  entity_type TEXT,
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'system',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  notification_frequency TEXT DEFAULT 'instant',
  dashboard_layout JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.bias_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES public.models(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL,
  protected_attribute TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('pass', 'fail', 'warning')),
  score DECIMAL(5,4),
  threshold DECIMAL(5,4),
  details JSONB,
  tested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  test_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bias_tests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Tasks
CREATE POLICY "Users can view organization tasks"
  ON public.tasks FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can insert organization tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can update organization tasks"
  ON public.tasks FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can delete organization tasks"
  ON public.tasks FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for Risks
CREATE POLICY "Users can view organization risks"
  ON public.risks FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can insert organization risks"
  ON public.risks FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can update organization risks"
  ON public.risks FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can delete organization risks"
  ON public.risks FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for Evidence
CREATE POLICY "Users can view organization evidence"
  ON public.evidence FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can insert organization evidence"
  ON public.evidence FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can update organization evidence"
  ON public.evidence FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can delete organization evidence"
  ON public.evidence FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for Policies
CREATE POLICY "Users can view organization policies"
  ON public.policies FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can insert organization policies"
  ON public.policies FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can update organization policies"
  ON public.policies FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can delete organization policies"
  ON public.policies FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- RLS Policies for Notifications
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own notifications"
  ON public.notifications FOR DELETE
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for User Preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  USING (user_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

-- RLS Policies for Bias Tests
CREATE POLICY "Users can view organization bias tests"
  ON public.bias_tests FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can insert organization bias tests"
  ON public.bias_tests FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can update organization bias tests"
  ON public.bias_tests FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can delete organization bias tests"
  ON public.bias_tests FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

-- Triggers for new tables
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_risks_updated_at
  BEFORE UPDATE ON public.risks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_evidence_updated_at
  BEFORE UPDATE ON public.evidence
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON public.policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes
CREATE INDEX idx_tasks_organization_id ON public.tasks(organization_id);
CREATE INDEX idx_tasks_assignee_id ON public.tasks(assignee_id);
CREATE INDEX idx_tasks_status ON public.tasks(status);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX idx_risks_organization_id ON public.risks(organization_id);
CREATE INDEX idx_risks_severity ON public.risks(severity);
CREATE INDEX idx_risks_mitigation_status ON public.risks(mitigation_status);
CREATE INDEX idx_evidence_organization_id ON public.evidence(organization_id);
CREATE INDEX idx_evidence_model_id ON public.evidence(model_id);
CREATE INDEX idx_evidence_vendor_id ON public.evidence(vendor_id);
CREATE INDEX idx_policies_organization_id ON public.policies(organization_id);
CREATE INDEX idx_policies_status ON public.policies(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX idx_bias_tests_organization_id ON public.bias_tests(organization_id);
CREATE INDEX idx_bias_tests_model_id ON public.bias_tests(model_id);

-- Sample tasks
INSERT INTO public.tasks (organization_id, title, description, status, priority, category, due_date) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Complete NYC LL144 bias audit', 'Perform required bias audit for HireScore model', 'in_progress', 'critical', 'Compliance', CURRENT_DATE + INTERVAL '7 days'),
  ('00000000-0000-0000-0000-000000000001', 'Review vendor security assessment', 'TalentScore Inc security certification needs review', 'todo', 'high', 'Vendor Management', CURRENT_DATE + INTERVAL '14 days'),
  ('00000000-0000-0000-0000-000000000001', 'Update model documentation', 'Document new features in CandidateRank v1.9', 'todo', 'medium', 'Documentation', CURRENT_DATE + INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000001', 'Train HR team on AI governance', 'Conduct training session on compliant AI usage', 'review', 'medium', 'Training', CURRENT_DATE + INTERVAL '21 days');

-- Sample risks
INSERT INTO public.risks (organization_id, title, description, category, severity, likelihood, mitigation_status, mitigation_plan) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Age discrimination in candidate scoring', 'HireScore model shows potential bias against candidates over 50', 'Bias & Fairness', 'major', 'high', 'in_progress', 'Retrain model with balanced dataset, implement continuous monitoring'),
  ('00000000-0000-0000-0000-000000000001', 'Vendor data breach exposure', 'TalentScore processes sensitive candidate data without SOC2', 'Data Security', 'critical', 'medium', 'not_started', 'Require SOC2 certification or terminate contract'),
  ('00000000-0000-0000-0000-000000000001', 'Model drift in production', 'CandidateRank accuracy degrading over time', 'Model Performance', 'moderate', 'high', 'in_progress', 'Implement automated drift detection and retraining pipeline'),
  ('00000000-0000-0000-0000-000000000001', 'Regulatory non-compliance fine', 'Colorado AI Act compliance deadline approaching', 'Compliance', 'major', 'medium', 'not_started', 'Complete compliance assessment and remediation plan');

-- Sample policies
INSERT INTO public.policies (organization_id, title, description, category, version, status, effective_date, review_date) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AI Model Governance Policy', 'Defines requirements for approving and monitoring AI models', 'Governance', '2.0', 'published', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days'),
  ('00000000-0000-0000-0000-000000000001', 'Third-Party AI Vendor Policy', 'Requirements for onboarding and monitoring AI vendors', 'Vendor Management', '1.5', 'published', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days'),
  ('00000000-0000-0000-0000-000000000001', 'AI Incident Response Procedure', 'Steps for responding to AI-related incidents', 'Incident Management', '1.0', 'under_review', NULL, CURRENT_DATE + INTERVAL '14 days'),
  ('00000000-0000-0000-0000-000000000001', 'Bias Testing and Remediation Policy', 'Guidelines for conducting and responding to bias audits', 'Fairness', '1.2', 'draft', NULL, NULL);

-- Sample evidence
INSERT INTO public.evidence (organization_id, name, description, evidence_type, category, file_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'HireScore Bias Audit Report Q4 2025', 'Annual bias audit conducted by independent auditor', 'audit_report', 'Compliance', 'pdf'),
  ('00000000-0000-0000-0000-000000000001', 'TalentScore Data Processing Agreement', 'Signed DPA with TalentScore Inc', 'document', 'Legal', 'pdf'),
  ('00000000-0000-0000-0000-000000000001', 'Model Validation Test Results', 'Performance validation for CandidateRank v1.8', 'test_result', 'Testing', 'csv'),
  ('00000000-0000-0000-0000-000000000001', 'ISO 42001 Certificate', 'AI Management System certification', 'certification', 'Compliance', 'pdf');

-- Notification trigger function
CREATE OR REPLACE FUNCTION public.notify_task_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.assignee_id IS NOT NULL AND (OLD.assignee_id IS NULL OR OLD.assignee_id != NEW.assignee_id) THEN
    INSERT INTO public.notifications (organization_id, user_id, type, title, message, link, entity_type, entity_id)
    VALUES (
      NEW.organization_id,
      NEW.assignee_id,
      'task_assigned',
      'New Task Assigned',
      'You have been assigned: ' || NEW.title,
      '/tasks',
      'task',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_task_assigned
  AFTER INSERT OR UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.notify_task_assigned();

-- Deadline notification function
CREATE OR REPLACE FUNCTION public.check_deadline_notifications()
RETURNS void AS $$
DECLARE
  task_record RECORD;
BEGIN
  FOR task_record IN
    SELECT t.*, p.id as profile_id
    FROM public.tasks t
    JOIN public.profiles p ON t.assignee_id = p.id
    WHERE t.due_date = CURRENT_DATE + INTERVAL '7 days'
    AND t.status NOT IN ('completed')
  LOOP
    INSERT INTO public.notifications (organization_id, user_id, type, title, message, link, entity_type, entity_id)
    VALUES (
      task_record.organization_id,
      task_record.profile_id,
      'deadline_approaching',
      'Task Due in 7 Days',
      'Task "' || task_record.title || '" is due in 7 days',
      '/tasks',
      'task',
      task_record.id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;

  FOR task_record IN
    SELECT t.*, p.id as profile_id
    FROM public.tasks t
    JOIN public.profiles p ON t.assignee_id = p.id
    WHERE t.due_date = CURRENT_DATE + INTERVAL '1 day'
    AND t.status NOT IN ('completed')
  LOOP
    INSERT INTO public.notifications (organization_id, user_id, type, title, message, link, entity_type, entity_id)
    VALUES (
      task_record.organization_id,
      task_record.profile_id,
      'deadline_approaching',
      'Task Due Tomorrow',
      'Task "' || task_record.title || '" is due tomorrow!',
      '/tasks',
      'task',
      task_record.id
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================================
-- PART 5: Bias tests seed data
-- ============================================================

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT '00000000-0000-0000-0000-000000000001', m.id, 'adverse_impact', 'Gender', 'pass', 0.85, 0.80,
  '{"notes": "Adverse Impact Ratio within acceptable range for all gender groups"}'::jsonb, CURRENT_DATE - INTERVAL '15 days'
FROM public.models m WHERE m.name = 'HireScore' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT '00000000-0000-0000-0000-000000000001', m.id, 'adverse_impact', 'Race/Ethnicity', 'fail', 0.72, 0.80,
  '{"notes": "AIR below 0.8 threshold - requires mitigation for minority groups"}'::jsonb, CURRENT_DATE - INTERVAL '15 days'
FROM public.models m WHERE m.name = 'HireScore' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT '00000000-0000-0000-0000-000000000001', m.id, 'demographic_parity', 'Age', 'warning', 0.81, 0.80,
  '{"notes": "Close to threshold - monitoring recommended for 50+ age group"}'::jsonb, CURRENT_DATE - INTERVAL '14 days'
FROM public.models m WHERE m.name = 'CandidateRank' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT '00000000-0000-0000-0000-000000000001', m.id, 'equalized_odds', 'Gender', 'pass', 0.92, 0.85,
  '{"notes": "Strong performance across all gender groups"}'::jsonb, CURRENT_DATE - INTERVAL '12 days'
FROM public.models m WHERE m.name = 'ResumeParser' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT '00000000-0000-0000-0000-000000000001', m.id, 'adverse_impact', 'Disability Status', 'pass', 0.88, 0.80,
  '{"notes": "Meets AIR threshold for disability status"}'::jsonb, CURRENT_DATE - INTERVAL '10 days'
FROM public.models m WHERE m.name = 'HireScore' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT '00000000-0000-0000-0000-000000000001', m.id, 'calibration', 'Veteran Status', 'pass', 0.91, 0.85,
  '{"notes": "Model well-calibrated across veteran status groups"}'::jsonb, CURRENT_DATE - INTERVAL '8 days'
FROM public.models m WHERE m.name = 'CandidateRank' AND m.organization_id = '00000000-0000-0000-0000-000000000001';


-- ============================================================
-- PART 6: Use Cases table
-- ============================================================

CREATE TYPE public.use_case_status AS ENUM ('not_started', 'in_progress', 'completed', 'on_hold');
CREATE TYPE public.use_case_risk AS ENUM ('low', 'medium', 'high');

CREATE TABLE public.use_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status use_case_status NOT NULL DEFAULT 'not_started',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  risk_level use_case_risk NOT NULL DEFAULT 'medium',
  department TEXT,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  owner_name TEXT,
  model_id UUID REFERENCES public.models(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  business_justification TEXT,
  target_completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view organization use cases"
  ON public.use_cases FOR SELECT
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can insert organization use cases"
  ON public.use_cases FOR INSERT
  WITH CHECK (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can update organization use cases"
  ON public.use_cases FOR UPDATE
  USING (organization_id = public.get_user_organization_id(auth.uid()));
CREATE POLICY "Users can delete organization use cases"
  ON public.use_cases FOR DELETE
  USING (organization_id = public.get_user_organization_id(auth.uid()));

CREATE TRIGGER update_use_cases_updated_at
  BEFORE UPDATE ON public.use_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_use_cases_organization_id ON public.use_cases(organization_id);
CREATE INDEX idx_use_cases_status ON public.use_cases(status);
CREATE INDEX idx_use_cases_risk_level ON public.use_cases(risk_level);

INSERT INTO public.use_cases (organization_id, name, description, status, progress, risk_level, department, owner_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AI Recruitment Screening Platform', 'Automated resume screening and candidate ranking system for hiring process', 'not_started', 0, 'high', 'Human Resources', 'John Doe'),
  ('00000000-0000-0000-0000-000000000001', 'Student Performance Prediction', 'ML model to predict student academic performance and identify at-risk students', 'in_progress', 45, 'medium', 'Education', 'Sarah Wilson'),
  ('00000000-0000-0000-0000-000000000001', 'Customer Churn Analysis', 'Predictive model to identify customers likely to churn', 'completed', 100, 'low', 'Marketing', 'Mike Johnson'),
  ('00000000-0000-0000-0000-000000000001', 'Loan Default Prediction', 'AI model to assess credit risk for loan applications', 'in_progress', 60, 'high', 'Finance', 'Emily Chen'),
  ('00000000-0000-0000-0000-000000000001', 'Employee Sentiment Analysis', 'NLP model to analyze employee feedback and satisfaction', 'on_hold', 30, 'medium', 'Human Resources', 'Alex Rivera');


-- ============================================================
-- PART 7: Evidence storage bucket
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  52428800,
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can view organization evidence files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can upload organization evidence files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update organization evidence files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete organization evidence files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- ============================================================
-- DONE! Your database is fully set up.
-- ============================================================
