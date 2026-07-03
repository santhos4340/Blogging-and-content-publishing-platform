import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from Supabase PostgreSQL database
  const fetchUserProfile = async (userId, emailFallback) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
      }

      if (data) {
        setProfile(data);
      } else {
        // Fallback transient profile
        setProfile({
          user_id: userId,
          email: emailFallback,
          full_name: emailFallback ? emailFallback.split('@')[0] : 'User',
          role: 'USER',
        });
      }
    } catch (err) {
      console.error('Unexpected profile error:', err);
    }
  };

  useEffect(() => {
    // Check initial active session
    const initializeAuth = async () => {
      try {
        const { data: { session: activeSession } } = await supabase.auth.getSession();
        setSession(activeSession);
        setUser(activeSession?.user || null);

        if (activeSession?.user) {
          await fetchUserProfile(activeSession.user.id, activeSession.user.email);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id, currentSession.user.email);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Register new user
  const registerUser = async ({ fullName, email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        // Create user profile in profiles table with default role USER
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            user_id: data.user.id,
            full_name: fullName,
            email: email,
            role: 'USER',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

        if (profileError) {
          console.warn('Profile table insert warning:', profileError.message);
        }
      }

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setUser(data.user);
      setSession(data.session);
      await fetchUserProfile(data.user.id, data.user.email);

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid credentials' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfileData = async (updatedFields) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    try {
      // Exclude role from user updates to prevent unauthorized escalation
      const { role, ...allowedFields } = updatedFields;

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          email: user.email,
          ...allowedFields,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    registerUser,
    loginUser,
    logoutUser,
    updateProfileData,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
