-- Create Storage bucket for evidence files
-- Note: This requires Supabase Storage to be enabled in your project

-- Create the evidence bucket (if not exists - Supabase handles this differently)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'evidence',
  'evidence',
  false,
  52428800, -- 50MB file size limit
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for the evidence bucket
-- Policy: Users can view files in their organization's folder
CREATE POLICY "Users can view organization evidence files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can upload files to their organization's folder
CREATE POLICY "Users can upload organization evidence files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can update files in their organization's folder
CREATE POLICY "Users can update organization evidence files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can delete files in their organization's folder
CREATE POLICY "Users can delete organization evidence files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'evidence' AND
  (storage.foldername(name))[1] = (
    SELECT organization_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);
