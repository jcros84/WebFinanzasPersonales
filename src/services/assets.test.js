import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAssets, createAsset, updateAsset, deleteAsset } from './assets';
import { mockResponse, supabase } from '../__mocks__/supabase';

describe('Assets Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAssets', () => {
    it('should return assets when supabase call is successful', async () => {
      const mockData = [{ ticker: 'AAPL', name: 'Apple Inc.' }];
      mockResponse.mockResolvedValueOnce({ data: mockData, error: null });

      const assets = await getAssets();

      expect(supabase.from).toHaveBeenCalledWith('assets');
      expect(assets).toEqual(mockData);
    });

    it('should throw an error when supabase call fails', async () => {
      const mockError = new Error('Database error');
      mockResponse.mockResolvedValueOnce({ data: null, error: mockError });

      await expect(getAssets()).rejects.toThrow('Database error');
    });
  });

  describe('createAsset', () => {
    it('should insert a new asset and return the inserted asset', async () => {
      const mockAsset = { ticker: 'MSFT', name: 'Microsoft Corp.' };
      mockResponse.mockResolvedValueOnce({ data: [mockAsset], error: null });

      const result = await createAsset(mockAsset);

      expect(supabase.from).toHaveBeenCalledWith('assets');
      expect(result).toEqual(mockAsset);
    });

    it('should throw an error when creation fails', async () => {
      const mockAsset = { ticker: 'MSFT', name: 'Microsoft Corp.' };
      const mockError = new Error('Insert failed');
      mockResponse.mockResolvedValueOnce({ data: null, error: mockError });

      await expect(createAsset(mockAsset)).rejects.toThrow('Insert failed');
    });
  });

  describe('updateAsset', () => {
    it('should update an existing asset and return the updated asset', async () => {
      const updates = { name: 'Apple' };
      const mockUpdated = { ticker: 'AAPL', name: 'Apple' };
      mockResponse.mockResolvedValueOnce({ data: [mockUpdated], error: null });

      const result = await updateAsset('AAPL', updates);

      expect(supabase.from).toHaveBeenCalledWith('assets');
      expect(result).toEqual(mockUpdated);
    });

    it('should throw an error when update fails', async () => {
      const mockError = new Error('Update failed');
      mockResponse.mockResolvedValueOnce({ data: null, error: mockError });

      await expect(updateAsset('AAPL', { name: 'Apple' })).rejects.toThrow('Update failed');
    });
  });

  describe('deleteAsset', () => {
    it('should delete an asset and return true', async () => {
      mockResponse.mockResolvedValueOnce({ error: null });

      const result = await deleteAsset('AAPL');

      expect(supabase.from).toHaveBeenCalledWith('assets');
      expect(result).toBe(true);
    });

    it('should throw an error when deletion fails', async () => {
      const mockError = new Error('Delete failed');
      mockResponse.mockResolvedValueOnce({ error: mockError });

      await expect(deleteAsset('AAPL')).rejects.toThrow('Delete failed');
    });
  });
});
