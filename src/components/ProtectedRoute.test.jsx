import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Navigate: vi.fn(() => <div data-testid="navigate-mock" />),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading spinner when loading is true', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    const { container } = render(
      <ProtectedRoute>
        <div data-testid="child">Protected Content</div>
      </ProtectedRoute>
    );

    // Children should not be visible
    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    
    // Spinner class should be present
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should redirect to /login when user is not logged in', () => {
    useAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <ProtectedRoute>
        <div data-testid="child">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.queryByTestId('child')).not.toBeInTheDocument();
    expect(Navigate).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/login', replace: true }),
      undefined
    );
  });

  it('should render children when user is logged in', () => {
    useAuth.mockReturnValue({
      user: { id: '123', email: 'user@example.com' },
      loading: false,
    });

    render(
      <ProtectedRoute>
        <div data-testid="child">Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
