import { vi } from 'vitest';

export const mockResponse = vi.fn().mockResolvedValue({ data: [], error: null });

const mockQuery = {
  select: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  eq: vi.fn(),
  order: vi.fn(),
};

mockQuery.select.mockReturnValue(mockQuery);
mockQuery.insert.mockReturnValue(mockQuery);
mockQuery.update.mockReturnValue(mockQuery);
mockQuery.delete.mockReturnValue(mockQuery);
mockQuery.eq.mockReturnValue(mockQuery);
mockQuery.order.mockReturnValue(mockQuery);

// Make the query builder thenable so it can be awaited
mockQuery.then = (onFulfilled, onRejected) => {
  return mockResponse().then(onFulfilled, onRejected);
};

export const supabase = {
  from: vi.fn(() => mockQuery),
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    })),
    getUser: vi.fn(),
  }
};
