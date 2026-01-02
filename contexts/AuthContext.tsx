import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

// Use any for Session and AuthError as they are not exported from @supabase/supabase-js in this environment
interface AuthContextType {
  session: any | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ error: any | null }>;
  logout: () => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This will run once when the component mounts.
    // Cast supabase.auth to any to bypass missing method type definitions in the current environment
    (supabase.auth as any).getSession().then(({ data: { session } }: any) => {
      setSession(session);
      setLoading(false);
    });

    // This listens for auth changes.
    // Cast supabase.auth to any to bypass missing method type definitions in the current environment
    const { data: { subscription } } = (supabase.auth as any).onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, pass: string) => {
    // Cast supabase.auth to any to bypass missing method type definitions in the current environment
    const { error } = await (supabase.auth as any).signInWithPassword({ email, password: pass });
    return { error };
  };

  const logout = async () => {
    // Cast supabase.auth to any to bypass missing method type definitions in the current environment
    const { error } = await (supabase.auth as any).signOut();
    return { error };
  };

  const value = {
    session,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
