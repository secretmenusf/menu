ALTER TABLE public.testimonial_submissions
  ADD COLUMN IF NOT EXISTS social_platform TEXT,
  ADD COLUMN IF NOT EXISTS social_handle TEXT,
  ADD COLUMN IF NOT EXISTS social_url TEXT;
