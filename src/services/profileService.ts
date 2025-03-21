
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { User } from '@/types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Convert Supabase row to User type
const mapToUser = (row: ProfileRow): User => {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatar: row.avatar || undefined,
  };
};

// Get current user profile
export const getCurrentProfile = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching current profile:', error);
    throw error;
  }

  return mapToUser(data);
};

// Get all user profiles
export const getProfiles = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching profiles:', error);
    throw error;
  }

  return data.map(mapToUser);
};

// Get a profile by ID
export const getProfileById = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching profile with ID ${id}:`, error);
    throw error;
  }

  return mapToUser(data);
};

// Update current user profile
export const updateProfile = async (updates: Partial<Omit<User, 'id' | 'email'>>): Promise<User> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('No authenticated user found');
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      avatar: updates.avatar,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return mapToUser(data);
};
