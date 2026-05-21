import { describe, it, expect, beforeEach, vi } from 'vitest';
import { postContactMessage } from './messages';
import { mockResponse, supabase } from '../__mocks__/supabase';

describe('Messages Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console.error to prevent polluting test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should successfully post a contact message', async () => {
    const mockMsg = { name: 'Juan', email: 'juan@example.com', message: 'Hola' };
    const mockResult = [{ id: '123', ...mockMsg }];
    mockResponse.mockResolvedValueOnce({ data: mockResult, error: null });

    const result = await postContactMessage(mockMsg);

    expect(supabase.from).toHaveBeenCalledWith('messages');
    expect(result).toEqual(mockResult);
  });

  it('should throw and log an error when post fails', async () => {
    const mockMsg = { name: 'Juan', email: 'juan@example.com', message: 'Hola' };
    const mockError = new Error('Database insert failed');
    mockResponse.mockResolvedValueOnce({ data: null, error: mockError });

    await expect(postContactMessage(mockMsg)).rejects.toThrow('Database insert failed');
    expect(console.error).toHaveBeenCalled();
  });
});
