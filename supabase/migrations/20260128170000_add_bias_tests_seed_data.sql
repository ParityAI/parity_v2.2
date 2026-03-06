-- Add seed data for bias_tests table
-- This references models by selecting their IDs from the models table

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT
  '00000000-0000-0000-0000-000000000001',
  m.id,
  'adverse_impact',
  'Gender',
  'pass',
  0.85,
  0.80,
  '{"notes": "Adverse Impact Ratio within acceptable range for all gender groups"}'::jsonb,
  CURRENT_DATE - INTERVAL '15 days'
FROM public.models m WHERE m.name = 'HireScore' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT
  '00000000-0000-0000-0000-000000000001',
  m.id,
  'adverse_impact',
  'Race/Ethnicity',
  'fail',
  0.72,
  0.80,
  '{"notes": "AIR below 0.8 threshold - requires mitigation for minority groups"}'::jsonb,
  CURRENT_DATE - INTERVAL '15 days'
FROM public.models m WHERE m.name = 'HireScore' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT
  '00000000-0000-0000-0000-000000000001',
  m.id,
  'demographic_parity',
  'Age',
  'warning',
  0.81,
  0.80,
  '{"notes": "Close to threshold - monitoring recommended for 50+ age group"}'::jsonb,
  CURRENT_DATE - INTERVAL '14 days'
FROM public.models m WHERE m.name = 'CandidateRank' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT
  '00000000-0000-0000-0000-000000000001',
  m.id,
  'equalized_odds',
  'Gender',
  'pass',
  0.92,
  0.85,
  '{"notes": "Strong performance across all gender groups"}'::jsonb,
  CURRENT_DATE - INTERVAL '12 days'
FROM public.models m WHERE m.name = 'ResumeParser' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT
  '00000000-0000-0000-0000-000000000001',
  m.id,
  'adverse_impact',
  'Disability Status',
  'pass',
  0.88,
  0.80,
  '{"notes": "Meets AIR threshold for disability status"}'::jsonb,
  CURRENT_DATE - INTERVAL '10 days'
FROM public.models m WHERE m.name = 'HireScore' AND m.organization_id = '00000000-0000-0000-0000-000000000001';

INSERT INTO public.bias_tests (organization_id, model_id, test_type, protected_attribute, result, score, threshold, details, test_date)
SELECT
  '00000000-0000-0000-0000-000000000001',
  m.id,
  'calibration',
  'Veteran Status',
  'pass',
  0.91,
  0.85,
  '{"notes": "Model well-calibrated across veteran status groups"}'::jsonb,
  CURRENT_DATE - INTERVAL '8 days'
FROM public.models m WHERE m.name = 'CandidateRank' AND m.organization_id = '00000000-0000-0000-0000-000000000001';
