-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  preferred_currency TEXT NOT NULL DEFAULT 'EUR' CHECK (preferred_currency IN ('EUR', 'USD')),
  default_price_source TEXT NOT NULL DEFAULT 'cardmarket' CHECK (default_price_source IN ('cardmarket', 'tcgApi', 'ebay')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_cards table
CREATE TABLE public.user_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_card_id TEXT NOT NULL,
  card_name TEXT NOT NULL,
  card_set TEXT NOT NULL DEFAULT '',
  card_number TEXT NOT NULL DEFAULT '',
  card_image TEXT NOT NULL DEFAULT '',
  card_rarity TEXT NOT NULL DEFAULT '',
  card_era TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT 'western' CHECK (region IN ('western', 'japanese', 'korean', 'chinese')),
  language TEXT NOT NULL DEFAULT 'EN',
  condition TEXT NOT NULL DEFAULT 'Near Mint',
  finish TEXT NOT NULL DEFAULT 'Normal',
  is_graded BOOLEAN NOT NULL DEFAULT false,
  grading_company TEXT CHECK (grading_company IN ('PSA', 'BGS', 'CGC', 'PCA')),
  grade NUMERIC(3,1) CHECK (grade >= 1 AND grade <= 10),
  purchase_price INTEGER,
  estimated_price INTEGER NOT NULL DEFAULT 0,
  price_change NUMERIC(5,1) NOT NULL DEFAULT 0,
  acquired_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cards ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User cards policies
CREATE POLICY "Users can view their own cards" ON public.user_cards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own cards" ON public.user_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards" ON public.user_cards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards" ON public.user_cards
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_cards_user_id ON public.user_cards(user_id);
CREATE INDEX idx_user_cards_api_card_id ON public.user_cards(api_card_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();