-- ==============================================================================
-- Lovable & Supabase Auto-Migration: BongBangla Media & Creative Agency
-- Automatically applied by Lovable when connected to Supabase
-- ==============================================================================

-- 1. Create Leads / Inquiries Table
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT DEFAULT 'General Inquiry',
    budget TEXT DEFAULT '৳ ২৫,০০০',
    status TEXT DEFAULT 'New',
    notes TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Reels & Video Portfolio Table
CREATE TABLE IF NOT EXISTS public.reels (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL, -- cinema-ads, saree-shoot, viral-reels, facebook-ads, jewellery
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    tag TEXT DEFAULT '4K CINEMA',
    views TEXT DEFAULT '১.৫M ভিউজ',
    video_url TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    aspect_ratio TEXT DEFAULT '9:16',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Models Roster Table
CREATE TABLE IF NOT EXISTS public.models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    height TEXT DEFAULT '৫''৭"',
    shoots TEXT DEFAULT '২০+',
    image_url TEXT NOT NULL,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to prevent conflicts
DROP POLICY IF EXISTS "Allow public insert to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public select on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public update on leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public delete on leads" ON public.leads;

DROP POLICY IF EXISTS "Allow public select on reels" ON public.reels;
DROP POLICY IF EXISTS "Allow public insert on reels" ON public.reels;
DROP POLICY IF EXISTS "Allow public update on reels" ON public.reels;
DROP POLICY IF EXISTS "Allow public delete on reels" ON public.reels;

DROP POLICY IF EXISTS "Allow public select on models" ON public.models;
DROP POLICY IF EXISTS "Allow public insert on models" ON public.models;
DROP POLICY IF EXISTS "Allow public update on models" ON public.models;
DROP POLICY IF EXISTS "Allow public delete on models" ON public.models;

-- Create Policies for Public Access (Read & Insert for Website / Admin)
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Allow public update on leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on leads" ON public.leads FOR DELETE USING (true);

CREATE POLICY "Allow public select on reels" ON public.reels FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reels" ON public.reels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reels" ON public.reels FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on reels" ON public.reels FOR DELETE USING (true);

CREATE POLICY "Allow public select on models" ON public.models FOR SELECT USING (true);
CREATE POLICY "Allow public insert on models" ON public.models FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on models" ON public.models FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on models" ON public.models FOR DELETE USING (true);

-- Enable Realtime for Leads, Reels, Models
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leads'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'reels'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reels;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'models'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.models;
  END IF;
END $$;
