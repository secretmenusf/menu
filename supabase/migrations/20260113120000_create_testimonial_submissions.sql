-- Testimonials submissions table
CREATE TABLE IF NOT EXISTS public.testimonial_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  consent BOOLEAN NOT NULL DEFAULT false,
  video_url TEXT,
  thumbnail_url TEXT,
  image_urls TEXT[],
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.testimonial_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit testimonials"
  ON public.testimonial_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view approved testimonials"
  ON public.testimonial_submissions FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Admins can manage testimonials"
  ON public.testimonial_submissions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for testimonial uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('testimonials', 'testimonials', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read testimonial uploads"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'testimonials');

CREATE POLICY "Public upload testimonial files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'testimonials');
