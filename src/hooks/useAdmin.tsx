import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'moderator' | 'user';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setRoles([]);
      setLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          setRoles([]);
        } else {
          const userRoles = data?.map((r: { role: AppRole }) => r.role) || [];
          setRoles(userRoles);
          setIsAdmin(userRoles.includes('admin'));
        }
      } catch (err) {
        console.error('Error in admin check:', err);
        setIsAdmin(false);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  const getAllUsers = async () => {
    if (!isAdmin) return { data: null, error: new Error('Unauthorized') };
    
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false });

    return { data, error };
  };

  const getUserRoles = async () => {
    if (!isAdmin) return { data: null, error: new Error('Unauthorized') };
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  };

  const assignRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) return { error: new Error('Unauthorized') };
    
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role });

    return { error };
  };

  const removeRole = async (userId: string, role: AppRole) => {
    if (!isAdmin) return { error: new Error('Unauthorized') };
    
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', role);

    return { error };
  };

  return {
    isAdmin,
    loading,
    roles,
    hasRole,
    getAllUsers,
    getUserRoles,
    assignRole,
    removeRole,
  };
};
