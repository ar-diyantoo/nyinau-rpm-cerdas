import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: cleanName,
          },
        },
      });

      if (error) {
        if (error.message?.toLowerCase().includes('registered')) {
          toast.error('Email sudah terdaftar. Silakan login atau gunakan email lain.');
        } else if (error.message?.toLowerCase().includes('password')) {
          toast.error('Password terlalu lemah. Gunakan minimal 8 karakter.');
        } else {
          toast.error(error.message || 'Gagal membuat akun');
        }
        throw error;
      }

      toast.success('Akun berhasil dibuat! Silakan login.');
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        const msg = (error.message || '').toLowerCase();
        if (msg.includes('invalid login credentials')) {
          toast.error('Email atau password salah. Coba lagi atau daftar akun baru.');
        } else if (msg.includes('email not confirmed')) {
          toast.error('Email belum dikonfirmasi. Cek inbox/spam untuk verifikasi.');
        } else {
          toast.error(error.message || 'Gagal masuk');
        }
        throw error;
      }

      toast.success('Berhasil masuk!');
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Gagal masuk dengan Google');
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Berhasil keluar');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Gagal keluar');
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };
};
