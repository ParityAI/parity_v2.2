-- Migration: Add Tasks, Risks, Evidence, Policies, and Notifications tables
-- This migration adds all the missing tables needed for the MVP

-- Create additional enum types
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'completed');
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.risk_severity AS ENUM ('negligible', 'minor', 'moderate', 'major', 'critical');
CREATE TYPE public.risk_likelihood AS ENUM ('very_low', 'low', 'medium', 'high', 'very_high');
CREATE TYPE public.mitigation_status AS ENUM ('not_started', 'in_progress', 'completed', 'accepted');
CREATE TYPE public.policy_status AS ENUM ('draft', 'under_review', 'published', 'archived');
CREATE TYPE public.evidence_type AS ENUM ('document', 'screenshot', 'audit_report', 'certification', 'test_result', 'other');
CREATE TYPE public.notification_type AS ENUM ('task_assigned', 'deadline_approaching', 'incident_reported', 'assessment_required', 'policy_updated', 'system');

-- Tasks table
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

-- Risks table
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

-- Evidence table (document hub)
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

-- Policies table
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

-- Notifications table
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

-- User preferences table (for theme, notifications settings, etc.)
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

-- Bias tests table (for bias & fairness tracking)
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

-- RLS Policies for Notifications (user-specific)
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

-- Apply updated_at triggers to new tables
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

-- Create indexes for better query performance
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

-- Insert sample data for demo organization
INSERT INTO public.tasks (organization_id, title, description, status, priority, category, due_date) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Complete NYC LL144 bias audit', 'Perform required bias audit for HireScore model', 'in_progress', 'critical', 'Compliance', CURRENT_DATE + INTERVAL '7 days'),
  ('00000000-0000-0000-0000-000000000001', 'Review vendor security assessment', 'TalentScore Inc security certification needs review', 'todo', 'high', 'Vendor Management', CURRENT_DATE + INTERVAL '14 days'),
  ('00000000-0000-0000-0000-000000000001', 'Update model documentation', 'Document new features in CandidateRank v1.9', 'todo', 'medium', 'Documentation', CURRENT_DATE + INTERVAL '30 days'),
  ('00000000-0000-0000-0000-000000000001', 'Train HR team on AI governance', 'Conduct training session on compliant AI usage', 'review', 'medium', 'Training', CURRENT_DATE + INTERVAL '21 days');

INSERT INTO public.risks (organization_id, title, description, category, severity, likelihood, mitigation_status, mitigation_plan) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Age discrimination in candidate scoring', 'HireScore model shows potential bias against candidates over 50', 'Bias & Fairness', 'major', 'high', 'in_progress', 'Retrain model with balanced dataset, implement continuous monitoring'),
  ('00000000-0000-0000-0000-000000000001', 'Vendor data breach exposure', 'TalentScore processes sensitive candidate data without SOC2', 'Data Security', 'critical', 'medium', 'not_started', 'Require SOC2 certification or terminate contract'),
  ('00000000-0000-0000-0000-000000000001', 'Model drift in production', 'CandidateRank accuracy degrading over time', 'Model Performance', 'moderate', 'high', 'in_progress', 'Implement automated drift detection and retraining pipeline'),
  ('00000000-0000-0000-0000-000000000001', 'Regulatory non-compliance fine', 'Colorado AI Act compliance deadline approaching', 'Compliance', 'major', 'medium', 'not_started', 'Complete compliance assessment and remediation plan');

INSERT INTO public.policies (organization_id, title, description, category, version, status, effective_date, review_date) VALUES
  ('00000000-0000-0000-0000-000000000001', 'AI Model Governance Policy', 'Defines requirements for approving and monitoring AI models', 'Governance', '2.0', 'published', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days'),
  ('00000000-0000-0000-0000-000000000001', 'Third-Party AI Vendor Policy', 'Requirements for onboarding and monitoring AI vendors', 'Vendor Management', '1.5', 'published', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days'),
  ('00000000-0000-0000-0000-000000000001', 'AI Incident Response Procedure', 'Steps for responding to AI-related incidents', 'Incident Management', '1.0', 'under_review', NULL, CURRENT_DATE + INTERVAL '14 days'),
  ('00000000-0000-0000-0000-000000000001', 'Bias Testing and Remediation Policy', 'Guidelines for conducting and responding to bias audits', 'Fairness', '1.2', 'draft', NULL, NULL);

INSERT INTO public.evidence (organization_id, name, description, evidence_type, category, file_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'HireScore Bias Audit Report Q4 2025', 'Annual bias audit conducted by independent auditor', 'audit_report', 'Compliance', 'pdf'),
  ('00000000-0000-0000-0000-000000000001', 'TalentScore Data Processing Agreement', 'Signed DPA with TalentScore Inc', 'document', 'Legal', 'pdf'),
  ('00000000-0000-0000-0000-000000000001', 'Model Validation Test Results', 'Performance validation for CandidateRank v1.8', 'test_result', 'Testing', 'csv'),
  ('00000000-0000-0000-0000-000000000001', 'ISO 42001 Certificate', 'AI Management System certification', 'certification', 'Compliance', 'pdf');

-- Function to create notification on task assignment
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

-- Function to create notification for upcoming deadlines (called by scheduled job)
CREATE OR REPLACE FUNCTION public.check_deadline_notifications()
RETURNS void AS $$
DECLARE
  task_record RECORD;
BEGIN
  -- Notify for tasks due in 7 days
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

  -- Notify for tasks due tomorrow
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
