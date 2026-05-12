import { supabase } from "../lib/supabase";

/**
 * Fetch all assets
 */
export const getAssets = async () => {
  const { data, error } = await supabase.from("assets").select("*");
  if (error) throw error;
  return data;
};

/**
 * Create a new asset
 * @param {Object} asset - { name, ticker, asset_type }
 */
export const createAsset = async (asset) => {
  const { data, error } = await supabase
    .from("assets")
    .insert([asset])
    .select();
  if (error) throw error;
  return data[0];
};

/**
 * Update an existing asset
 * @param {string} id - UUID of the asset
 * @param {Object} updates - fields to update
 */
export const updateAsset = async (id, updates) => {
  const { data, error } = await supabase
    .from("assets")
    .update(updates)
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
};

/**
 * Delete an asset
 * @param {string} id - UUID of the asset
 */
export const deleteAsset = async (id) => {
  const { error } = await supabase.from("assets").delete().eq("id", id);
  if (error) throw error;
  return true;
};
