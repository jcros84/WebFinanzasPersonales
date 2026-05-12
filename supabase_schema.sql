-- SQL Schema for Supabase

-- 1. Portfolios Table
CREATE TABLE portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) -- Optional: for authentication
);

-- 2. Transactions Table
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  type TEXT NOT NULL, -- BUY, SELL, DRIP
  shares DECIMAL NOT NULL,
  price DECIMAL NOT NULL,
  total DECIMAL NOT NULL,
  asset_type TEXT NOT NULL, -- STOCK, ETF, OPTION
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Dividends Table
CREATE TABLE dividends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Messages (Contact Form)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS (Optional but recommended)
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies (Example: Allow all for now, or restrict by user_id)
CREATE POLICY "Allow all for now" ON portfolios FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON transactions FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON dividends FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON messages FOR INSERT WITH CHECK (true);
