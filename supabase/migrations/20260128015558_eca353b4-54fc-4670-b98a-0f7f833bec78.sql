-- Add deadline tracking to compliance_assessments
ALTER TABLE public.compliance_assessments 
ADD COLUMN IF NOT EXISTS deadline timestamp with time zone,
ADD COLUMN IF NOT EXISTS checklist_progress jsonb DEFAULT '[]'::jsonb;

-- Create a table to store framework checklist templates
CREATE TABLE IF NOT EXISTS public.framework_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id uuid REFERENCES public.compliance_frameworks(id) ON DELETE CASCADE NOT NULL,
  item_text text NOT NULL,
  category text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.framework_checklists ENABLE ROW LEVEL SECURITY;

-- Anyone can view checklist items (they are templates)
CREATE POLICY "Anyone can view framework checklists"
ON public.framework_checklists
FOR SELECT
USING (true);

-- Insert checklist items for NYC LL144
INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order) VALUES
('0b3985c0-31ca-492b-9dd8-b8c860efea33', 'Conduct annual bias audit by independent auditor', 'Audit', 1),
('0b3985c0-31ca-492b-9dd8-b8c860efea33', 'Publish bias audit results on company website', 'Disclosure', 2),
('0b3985c0-31ca-492b-9dd8-b8c860efea33', 'Provide 10 business days notice to candidates', 'Notice', 3),
('0b3985c0-31ca-492b-9dd8-b8c860efea33', 'Disclose AEDT use in job postings', 'Notice', 4),
('0b3985c0-31ca-492b-9dd8-b8c860efea33', 'Allow candidates to request alternative selection process', 'Candidate Rights', 5),
('0b3985c0-31ca-492b-9dd8-b8c860efea33', 'Calculate impact ratios for sex, race/ethnicity categories', 'Analysis', 6),
('0b3985c0-31ca-492b-9dd8-b8c860efea33', 'Document data sources and selection criteria', 'Documentation', 7);

-- Insert checklist items for EU AI Act
INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order) VALUES
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Classify AI system risk level (minimal/limited/high/unacceptable)', 'Classification', 1),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Register high-risk AI systems in EU database', 'Registration', 2),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Implement risk management system', 'Risk Management', 3),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Ensure data governance and quality measures', 'Data Governance', 4),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Maintain technical documentation', 'Documentation', 5),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Enable logging and record-keeping', 'Monitoring', 6),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Provide transparency to users', 'Transparency', 7),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Ensure human oversight capabilities', 'Oversight', 8),
('d698dfa3-f520-4c3b-a47f-f7d10e58b030', 'Conduct conformity assessment', 'Assessment', 9);

-- Insert checklist items for Colorado AI Act
INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order) VALUES
('fc4284e4-6d3e-47af-9e33-6026f91d9094', 'Complete impact assessment for high-risk AI systems', 'Assessment', 1),
('fc4284e4-6d3e-47af-9e33-6026f91d9094', 'Disclose AI use to consumers', 'Disclosure', 2),
('fc4284e4-6d3e-47af-9e33-6026f91d9094', 'Provide explanation of AI decision factors', 'Transparency', 3),
('fc4284e4-6d3e-47af-9e33-6026f91d9094', 'Enable consumer appeal process', 'Consumer Rights', 4),
('fc4284e4-6d3e-47af-9e33-6026f91d9094', 'Maintain documentation of AI system purpose', 'Documentation', 5);

-- Insert checklist items for Illinois AIVOIA
INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order) VALUES
('f031227d-b688-41f0-bf5c-088fb9272210', 'Obtain consent before AI video analysis', 'Consent', 1),
('f031227d-b688-41f0-bf5c-088fb9272210', 'Explain AI evaluation criteria to applicants', 'Disclosure', 2),
('f031227d-b688-41f0-bf5c-088fb9272210', 'Limit video sharing to necessary personnel', 'Data Protection', 3),
('f031227d-b688-41f0-bf5c-088fb9272210', 'Delete videos within 30 days upon request', 'Data Retention', 4),
('f031227d-b688-41f0-bf5c-088fb9272210', 'Report demographic data to state annually', 'Reporting', 5);

-- Insert checklist items for ISO 42001
INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order) VALUES
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Establish AI management system scope', 'Governance', 1),
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Define AI policy and objectives', 'Policy', 2),
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Conduct AI risk assessment', 'Risk Management', 3),
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Implement AI controls and safeguards', 'Controls', 4),
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Monitor and measure AI performance', 'Monitoring', 5),
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Conduct internal audits', 'Audit', 6),
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Management review of AI systems', 'Review', 7),
('fc1c6364-a79a-4d00-ab1e-b2b434663553', 'Continuous improvement process', 'Improvement', 8);

-- Insert checklist items for NIST AI RMF
INSERT INTO public.framework_checklists (framework_id, item_text, category, sort_order) VALUES
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Map AI system context and stakeholders', 'Govern', 1),
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Establish governance structure', 'Govern', 2),
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Identify and categorize AI risks', 'Map', 3),
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Analyze potential impacts', 'Map', 4),
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Measure and assess risks', 'Measure', 5),
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Track identified risks', 'Measure', 6),
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Implement risk response strategies', 'Manage', 7),
('19807a64-02ed-4a1d-8bd1-c2f65ebaef0d', 'Monitor effectiveness of controls', 'Manage', 8);