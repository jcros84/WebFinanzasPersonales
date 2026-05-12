import { supabase } from '../lib/supabase';

/**
 * Portfolios API
 */
export const getPortfolios = async () => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*');
  
  if (error) throw error;
  return { data }; // Returning { data } to maintain some compatibility with previous axios structure if possible
};

export const createPortfolio = async (portfolioData) => {
  const { data, error } = await supabase
    .from('portfolios')
    .insert([portfolioData])
    .select();
  
  if (error) throw error;
  return { data: data[0] };
};

/**
 * Transactions API
 */
export const getTransactions = async (portfolioId) => {
  let query = supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  
  if (portfolioId) {
    query = query.eq('portfolio_id', portfolioId);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return { data };
};

export const createTransaction = async (transactionData) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transactionData])
    .select();
  
  if (error) throw error;
  return { data: data[0] };
};

/**
 * Dividends API
 */
export const getDividends = async (portfolioId) => {
  let query = supabase
    .from('dividends')
    .select('*')
    .order('date', { ascending: false });

  if (portfolioId) {
    query = query.eq('portfolio_id', portfolioId);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  return { data };
};

export const createDividend = async (dividendData) => {
  const { data, error } = await supabase
    .from('dividends')
    .insert([dividendData])
    .select();
  
  if (error) throw error;
  return { data: data[0] };
};
