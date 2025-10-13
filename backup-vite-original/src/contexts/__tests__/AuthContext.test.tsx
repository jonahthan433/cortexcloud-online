import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn()
    }
  }
}));

const TestComponent = () => {
  const { user, loading, signUp, signIn, signOut, signInWithGoogle } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <button onClick={() => signUp('test@example.com', 'password', 'Test User', 'Test Company')}>
        Sign Up
      </button>
      <button onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signInWithGoogle()}>
        Sign In with Google
      </button>
      <button onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('loading');
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
  });

  it('should handle successful sign up', async () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
        company: 'Test Company'
      }
    };

    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText('Sign Up');
    signUpButton.click();

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password',
        options: {
          data: {
            full_name: 'Test User',
            company: 'Test Company'
          }
        }
      });
    });
  });

  it('should handle sign up error', async () => {
    const mockError = { message: 'Sign up failed' };
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText('Sign Up');
    signUpButton.click();

    await waitFor(() => {
      expect(supabase.auth.signUp).toHaveBeenCalled();
    });
  });

  it('should handle successful sign in', async () => {
    const mockUser = {
      id: 'test-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
        company: 'Test Company'
      }
    };

    const mockSession = {
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
      user: mockUser
    };

    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password'
      });
    });
  });

  it('should handle sign in error', async () => {
    const mockError = { message: 'Invalid credentials' };
    (supabase.auth.signInWithPassword as any).mockResolvedValue({
      data: { user: null, session: null },
      error: mockError
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    signInButton.click();

    await waitFor(() => {
      expect(supabase.auth.signInWithPassword).toHaveBeenCalled();
    });
  });

  it('should handle Google sign in', async () => {
    (supabase.auth.signInWithOAuth as any).mockResolvedValue({
      data: { provider: 'google', url: 'https://accounts.google.com/oauth/authorize' },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const googleSignInButton = screen.getByText('Sign In with Google');
    googleSignInButton.click();

    await waitFor(() => {
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
    });
  });

  it('should handle sign out', async () => {
    (supabase.auth.signOut as any).mockResolvedValue({
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signOutButton = screen.getByText('Sign Out');
    signOutButton.click();

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });
});
