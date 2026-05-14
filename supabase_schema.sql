-- SQL Schema for Supabase

-- 1. Portfolios Table
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- 2. Assets Table
CREATE TABLE IF NOT EXISTS assets (
  ticker TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  exchange TEXT,
  currency TEXT DEFAULT 'EUR',
  sector TEXT,
  subsector TEXT,
  asset_type TEXT DEFAULT 'Acción',
  estimated_annual_dividend NUMERIC DEFAULT 0,
  dividend_schedule JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- 3. Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  ticker TEXT REFERENCES assets(ticker),
  portfolio TEXT DEFAULT 'DGI',
  broker TEXT DEFAULT 'ING',
  date DATE NOT NULL,
  type TEXT CHECK (type IN ('BUY', 'SELL', 'SCRIP', 'DRIP')),
  shares NUMERIC NOT NULL,
  price_local NUMERIC NOT NULL,
  commission_eur NUMERIC DEFAULT 0,
  exchange_rate NUMERIC DEFAULT 1.0,
  total_local NUMERIC NOT NULL,
  total_eur NUMERIC NOT NULL,
  remaining_shares NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- 4. Dividends Table
CREATE TABLE IF NOT EXISTS dividends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  ticker TEXT REFERENCES assets(ticker),
  portfolio TEXT DEFAULT 'DGI',
  broker TEXT DEFAULT 'ING',
  date DATE NOT NULL,
  dividend_type TEXT DEFAULT 'Dividendo',
  gross_amount_eur NUMERIC NOT NULL,
  withholding_origin_eur NUMERIC DEFAULT 0,
  withholding_dest_eur NUMERIC DEFAULT 0,
  commission_eur NUMERIC DEFAULT 0,
  net_amount_eur NUMERIC NOT NULL,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- 5. Realized Gains Table
CREATE TABLE IF NOT EXISTS realized_gains (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sale_transaction_id UUID REFERENCES transactions(id),
  buy_transaction_id UUID REFERENCES transactions(id),
  shares_sold NUMERIC NOT NULL,
  buy_price_eur NUMERIC NOT NULL,
  sell_price_eur NUMERIC NOT NULL,
  profit_eur NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid()
);

-- 6. Messages (Contact Form)
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE dividends ENABLE ROW LEVEL SECURITY;
ALTER TABLE realized_gains ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Explicit GRANTS for Data API (Supabase 2026 Security Update)
GRANT ALL ON TABLE portfolios TO authenticated, service_role;
GRANT ALL ON TABLE assets TO authenticated, service_role;
GRANT ALL ON TABLE transactions TO authenticated, service_role;
GRANT ALL ON TABLE dividends TO authenticated, service_role;
GRANT ALL ON TABLE realized_gains TO authenticated, service_role;
GRANT ALL ON TABLE messages TO authenticated, service_role;
GRANT INSERT ON TABLE messages TO anon; -- Allow contact form submissions

-- Example RLS Policies
-- Portfolios
CREATE POLICY "Users can manage their own portfolios" ON portfolios
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Assets
CREATE POLICY "Users can manage their own assets" ON assets
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Transactions
CREATE POLICY "Users can manage their own transactions" ON transactions
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Dividends
CREATE POLICY "Users can manage their own dividends" ON dividends
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Realized Gains
CREATE POLICY "Users can manage their own realized gains" ON realized_gains
  FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Messages
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated users can see messages" ON messages
  FOR SELECT TO authenticated USING (true);
