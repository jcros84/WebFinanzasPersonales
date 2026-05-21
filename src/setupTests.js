import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { supabase } from './__mocks__/supabase';

vi.mock('./lib/supabase', () => ({
  supabase: supabase
}));
