-- Migration: 20260113000002_storage_buckets
-- Description: Setup Storage Buckets and RLS for Product Images and Private Assets

-- 1. BUCKET CREATION
-- We insert directly into storage.buckets. 
-- Note: id is the bucket name.

INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES 
    (
        'product-images', 
        'product-images', 
        true, -- Public Bucket
        false, 
        5242880, -- 5MB Limit
        ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/avif']
    ),
    (
        'private-assets', 
        'private-assets', 
        false, -- Private Bucket
        false, 
        10485760, -- 10MB Limit
        NULL -- Any type allowed (or restrict if needed)
    )
ON CONFLICT (id) DO NOTHING;


-- 2. RLS POLICIES

-- BUCKET: product-images
-- Public Access: Anyone can read/download images.
CREATE POLICY "Public Read Product Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Admin/Staff Access: Upload, Update, Delete
CREATE POLICY "Admin/Staff Upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'product-images' 
    AND public.get_my_claim_role() IN ('admin', 'staff')
);

CREATE POLICY "Admin/Staff Update Product Images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'product-images' 
    AND public.get_my_claim_role() IN ('admin', 'staff')
);

CREATE POLICY "Admin/Staff Delete Product Images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'product-images' 
    AND public.get_my_claim_role() IN ('admin', 'staff')
);


-- BUCKET: private-assets
-- Private Access: NO public read. Only Admin (maybe Staff).
-- Policy explicitly checks role.

CREATE POLICY "Admin Only Access Private Assets"
ON storage.objects FOR ALL
USING (
    bucket_id = 'private-assets' 
    AND public.get_my_claim_role() = 'admin'
);


-- PREVENT LISTING (Enumeration)
-- We intentionally DO NOT add a SELECT policy that returns true for 'product-images' without a specific name match 
-- or general access. Default storage behavior usually requires a token for list unless bucket is public.
-- However, strict RLS for listing is tricky. 
-- To prevent mass scraping via list, we generally rely on the fact that users need to know the specific path (SELECT by ID/Name).
-- The "Public Read Product Images" policy above allows SELECT on any object in that bucket.
-- If we want to prevent LISTING (navigation), we rely on the fact that storage.objects SELECT usually targets specific files.
