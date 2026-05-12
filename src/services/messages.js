import { supabase } from '../lib/supabase';

/**
 * Sends form data to Supabase 'messages' table
 * @param {Object} data - { name, email, message }
 */
export const postContactMessage = async (data) => {
  try {
    const { data: result, error } = await supabase
      .from('messages')
      .insert([data]);

    if (error) throw error;
    return result;
  } catch (error) {
    console.error('Error sending message to Supabase:', error);
    throw error;
  }
};
