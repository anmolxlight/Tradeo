-- Tradeo - Database Setup
-- Run this SQL in your Supabase SQL Editor to set up the database schema
-- Supabase Dashboard > SQL Editor > New Query > Paste and run

-- ─────────────────────────────
-- Extensions
-- ─────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────
-- Profiles Table
-- Stores user profile information synced from Clerk
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────
-- Stock Analyses Table
-- Stores AI-powered stock analysis results
-- ─────────────────────────────
CREATE TABLE IF NOT EXISTS stock_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  ticker TEXT NOT NULL,
  stock_data JSONB NOT NULL,
  analysis JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─────────────────────────────
-- Indexes
-- ─────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_analyses_user_id ON stock_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_analyses_ticker ON stock_analyses(ticker);
CREATE INDEX IF NOT EXISTS idx_stock_analyses_created_at ON stock_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stock_analyses_is_favorite ON stock_analyses(is_favorite) WHERE is_favorite = TRUE;

-- ─────────────────────────────
-- Auto-update updated_at trigger
-- ─────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stock_analyses_updated_at ON stock_analyses;
CREATE TRIGGER update_stock_analyses_updated_at
  BEFORE UPDATE ON stock_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────
-- Row Level Security (RLS)
-- ─────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_analyses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Stock analyses policies
DROP POLICY IF EXISTS "Users can view their own analyses" ON stock_analyses;
CREATE POLICY "Users can view their own analyses" ON stock_analyses
  FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can insert their own analyses" ON stock_analyses;
CREATE POLICY "Users can insert their own analyses" ON stock_analyses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update their own analyses" ON stock_analyses;
CREATE POLICY "Users can update their own analyses" ON stock_analyses
  FOR UPDATE USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can delete their own analyses" ON stock_analyses;
CREATE POLICY "Users can delete their own analyses" ON stock_analyses
  FOR DELETE USING (auth.uid()::text = user_id);

-- ─────────────────────────────
-- Auto-create profile on signup
-- Triggered when a new user is created in Clerk (via Supabase Auth users table)
-- ─────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name, avatar_url)
  VALUES (
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
