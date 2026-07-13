-- Alter listings table to support custom listing banner images
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('listing-images', 'listing-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Anyone can view listing images (public bucket)
CREATE POLICY "Public Read Access for listing images"
ON storage.objects FOR SELECT
USING (bucket_id = 'listing-images');

-- Storage RLS: Authenticated sellers can upload listing images
CREATE POLICY "Authenticated Upload for listing images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listing-images');

-- Storage RLS: Owners can update their listing images
CREATE POLICY "Owner Update for listing images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Storage RLS: Owners can delete their listing images
CREATE POLICY "Owner Delete for listing images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[2]);
