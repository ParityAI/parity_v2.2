-- Migration: Add Use Cases table for tracking AI use cases across the organization

-- Create enum types for use cases
CREATE TYPE public.use_case_status AS ENUM ('not_started', 'in_progress', 'completed', 'on_hold');
CREATE TYPE public.use_case_risk AS ENUM ('low', 'medium', 'high');

-- Use Cases table
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

-- Enable RLS
ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Trigger for updated_at
CREATE TRIGGER update_use_cases_updated_at
  BEFORE UPDATE ON public.use_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_use_cases_organization_id ON public.use_cases(organization_id);
CREATE INDEX idx_use_cases_status ON public.use_cases(status);
CREATE INDEX idx_use_cases_risk_level ON public.use_cases(risk_level);

-- Insert sample data for demo organization
INSERT INTO public.use_cases (organization_id, name, description, status, progress, risk_level, department, owner_name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AI Recruitment Screening Platform', 'Automated resume screening and candidate ranking system for hiring process', 'not_started', 0, 'high', 'Human Resources', 'John Doe'),
  ('00000000-0000-0000-0000-000000000001', 'Student Performance Prediction', 'ML model to predict student academic performance and identify at-risk students', 'in_progress', 45, 'medium', 'Education', 'Sarah Wilson'),
  ('00000000-0000-0000-0000-000000000001', 'Customer Churn Analysis', 'Predictive model to identify customers likely to churn', 'completed', 100, 'low', 'Marketing', 'Mike Johnson'),
  ('00000000-0000-0000-0000-000000000001', 'Loan Default Prediction', 'AI model to assess credit risk for loan applications', 'in_progress', 60, 'high', 'Finance', 'Emily Chen'),
  ('00000000-0000-0000-0000-000000000001', 'Employee Sentiment Analysis', 'NLP model to analyze employee feedback and satisfaction', 'on_hold', 30, 'medium', 'Human Resources', 'Alex Rivera');
