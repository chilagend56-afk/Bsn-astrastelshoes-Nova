import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface AppUser {
  id: string;
  role: 'admin' | 'customer';
  name: string;
  email: string;
}

interface AuthContextType {
  user: AppUser | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  signup: (email: string, password: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  supabaseUser: null, 
  loading: true,
  login: async () => { throw new Error('Not implemented'); },
  logout: async () => {},
  resetPassword: async () => { throw new Error('Not implemented'); }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('youngdangote_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseUser(session?.user ?? null);
      if (!session?.user) {
        setUser(null);
        localStorage.removeItem('youngdangote_user');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const sUser = session?.user ?? null;
      setSupabaseUser(sUser);
      
      try {
        if (sUser) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', sUser.id)
            .single();

          if (data && !error) {
            const appUser = data as AppUser;
            setUser(appUser);
            localStorage.setItem('youngdangote_user', JSON.stringify(appUser));
          } else {
            if (sUser.email === 'admin001@gmail.com' || sUser.email === 'ydangote1@gmail.com') {
              const adminUser: AppUser = {
                id: sUser.id,
                role: 'admin',
                name: 'Admin',
                email: sUser.email
              };
              await supabase.from('users').upsert({
                id: sUser.id,
                role: 'admin',
                name: 'Admin',
                email: sUser.email
              });
              setUser(adminUser);
              localStorage.setItem('youngdangote_user', JSON.stringify(adminUser));
            } else {
              setUser(null);
              localStorage.removeItem('youngdangote_user');
            }
          }
        } else {
          setUser(null);
          localStorage.removeItem('youngdangote_user');
        }
      } catch (err) {
        console.error("Auth context error:", err);
        setUser(null);
        localStorage.removeItem('youngdangote_user');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

    const signup = async (emailInput: string, passwordInput: string): Promise<AppUser> => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: emailInput,
      password: passwordInput,
    });
    
    if (signUpError) {
      if (signUpError.message.includes('rate limit')) {
        throw new Error("Email rate limit exceeded. Please disable Email Confirmations in Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email) to proceed.");
      }
      throw new Error(signUpError.message);
    }
    
    const sUser = signUpData.user;
    if (!sUser) throw new Error("Authentication failed for admin account.");

    const adminUser: AppUser = {
      id: sUser.id,
      role: 'admin',
      name: 'Admin',
      email: emailInput
    };

    await supabase.from('users').upsert({
      id: sUser.id,
      role: 'admin',
      name: 'Admin',
      email: emailInput
    });

    setUser(adminUser);
    localStorage.setItem('youngdangote_user', JSON.stringify(adminUser));
    return adminUser;
  };

  const login = async (emailInput: string, passwordInput: string): Promise<AppUser> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailInput,
      password: passwordInput,
    });

    if (authError) {
      if (authError.message.includes('Invalid login credentials') && (emailInput.toLowerCase() === 'admin001@gmail.com' || emailInput.toLowerCase() === 'ydangote1@gmail.com')) {
        throw new Error("Invalid login credentials. If you haven't created this admin account yet, please sign up first. If you are locked out, you may need to disable Email Confirmations in your Supabase Dashboard (Authentication -> Providers -> Email -> Confirm email).");
      }
      throw new Error(authError.message);
    }

    const sUser = authData.user;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sUser.id)
      .single();

    if (data && !error) {
      const appUser = data as AppUser;
      setUser(appUser);
      localStorage.setItem('youngdangote_user', JSON.stringify(appUser));
      return appUser;
    } else {
      const defaultUser: AppUser = {
        id: sUser.id,
        role: 'customer',
        name: sUser.user_metadata?.full_name || 'Customer',
        email: sUser.email || emailInput
      };
      setUser(defaultUser);
      localStorage.setItem('youngdangote_user', JSON.stringify(defaultUser));
      return defaultUser;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('youngdangote_user');
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw new Error(error.message);
  };

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
