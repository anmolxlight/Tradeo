-- Enable the uuid-ossp extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user information
CREATE TABLE profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stock_analyses table for storing analysis history
CREATE TABLE stock_analyses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  ticker TEXT NOT NULL,
  stock_data JSONB NOT NULL,
  analysis JSONB NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_stock_analyses_user_id ON stock_analyses(user_id);
CREATE INDEX idx_stock_analyses_ticker ON stock_analyses(ticker);
CREATE INDEX idx_stock_analyses_created_at ON stock_analyses(created_at DESC);
CREATE INDEX idx_stock_analyses_is_favorite ON stock_analyses(is_favorite) WHERE is_favorite = TRUE;

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_analyses_updated_at 
  BEFORE UPDATE ON stock_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_analyses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Stock analyses policies
CREATE POLICY "Users can view their own analyses" ON stock_analyses
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own analyses" ON stock_analyses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own analyses" ON stock_analyses
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own analyses" ON stock_analyses
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create a function to handle user creation
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

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample data (optional - remove in production)
-- This creates some example data for testing
-- INSERT INTO profiles (user_id, email, first_name, last_name) VALUES
--   ('user_test_123', 'test@example.com', 'Test', 'User');

-- INSERT INTO stock_analyses (user_id, ticker, stock_data, analysis) VALUES
--   ('user_test_123', 'AAPL', 
--    '{"ticker": "AAPL", "currentPrice": 150.25, "targetPrice": 170.00, "peRatio": 25.5, "priceChange": 2.5, "isIndian": false, "currency": "$", "lastUpdated": "2024-01-15T10:30:00Z"}',
--    '{"ticker": "AAPL", "sentiment": "bullish", "recommendation": "buy", "analysis": "Apple shows strong fundamentals with robust iPhone sales and growing services revenue.", "keyPoints": ["Strong Q4 earnings", "Growing services segment", "Positive market sentiment"], "riskLevel": "medium", "targetPrice": 170, "timeHorizon": "medium-term"}'
--   );