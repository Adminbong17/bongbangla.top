-- ============================================================================
-- BongBangla Media & Creative Lab - Complete Supabase Database Setup Script
-- Run this in your Supabase Project: SQL Editor -> New Query -> Run
-- Project: https://sfnyuzemaqplpdeedsgg.supabase.co
-- ============================================================================

-- 1. Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create 'models' Table
CREATE TABLE IF NOT EXISTS public.models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    height TEXT,
    shoots TEXT,
    image_url TEXT,
    available BOOLEAN DEFAULT true,
    age TEXT,
    measurements TEXT,
    skin_tone TEXT,
    eye_color TEXT,
    hair_color TEXT,
    location TEXT DEFAULT 'ঢাকা, বাংলাদেশ',
    experience TEXT,
    instagram TEXT,
    specialties TEXT,
    bio TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create 'reels' Table
CREATE TABLE IF NOT EXISTS public.reels (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    client TEXT,
    tag TEXT,
    views TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create 'leads' Table (Bookings & Enquiries)
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    budget TEXT,
    status TEXT DEFAULT 'New',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create 'hero_slides' Table
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT,
    image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create 'reviews' Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    model_id TEXT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    shoot_type TEXT,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 7. Disable RLS or Allow Public Access (For simple, zero-blocker client sync)
-- ============================================================================

ALTER TABLE public.models DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reels DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews DISABLE ROW LEVEL SECURITY;

-- If you prefer RLS Enabled with Anonymous Access:
-- ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all access to models" ON public.models FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all access to reels" ON public.reels FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime replication for multi-device live sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.models;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
