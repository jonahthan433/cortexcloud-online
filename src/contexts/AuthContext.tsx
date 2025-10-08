import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
  trial_started: boolean;
  trial_expires_at?: string;
  plan?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, name: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  startTrial: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for development login first
    if (import.meta.env.DEV && localStorage.getItem('dev-authenticated') === 'true') {
      const devUser = JSON.parse(localStorage.getItem('dev-user') || '{}');
      if (devUser.id) {
        console.log('🛠️ Development login detected');
        setUser(devUser);
        setLoading(false);
        return;
      }
    }

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Check if user exists in our users table
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (userData) {
        setUser({
          id: userData.id,
          email: userData.email,
          name: userData.name,
          company: userData.company,
          trial_started: userData.trial_started,
          trial_expires_at: userData.trial_expires_at,
          plan: userData.plan
        });
      } else {
        // User doesn't exist in our users table yet
        setUser({
          id: userId,
          email: '',
          trial_started: false
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await fetchUserData(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
            scope: 'https://www.googleapis.com/auth/calendar'
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Note: The actual user data will be handled by the auth state change listener
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign in with Google' };
    }
  };

  const signUp = async (email: string, password: string, name: string, company?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user record in our users table
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            company,
            trial_started: false,
            plan: 'trial'
          });

        if (insertError) {
          console.error('Error creating user record:', insertError);
        }

        return { success: true };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const startTrial = async (email: string) => {
    try {
      // Update user's trial status
      const { error } = await supabase
        .from('users')
        .update({
          trial_started: true,
          trial_expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
        })
        .eq('email', email);

      if (error) {
        return { success: false, error: error.message };
      }

      // Refresh user data
      if (user) {
        await fetchUserData(user.id);
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to start trial' };
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    startTrial,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
