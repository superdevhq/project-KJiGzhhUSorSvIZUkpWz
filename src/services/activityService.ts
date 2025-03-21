
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Activity, User } from '@/types';

type ActivityRow = Database['public']['Tables']['activities']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Helper function to map user data
const mapUser = async (userId: string | null): Promise<User> => {
  if (!userId) {
    return {
      id: 'system',
      name: 'System',
      email: 'system@example.com',
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    return {
      id: userId,
      name: 'Unknown User',
      email: 'unknown@example.com',
    };
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    avatar: data.avatar,
  };
};

// Convert Supabase row to Activity type
const mapToActivity = async (row: ActivityRow): Promise<Activity> => {
  const user = await mapUser(row.user_id);

  return {
    id: row.id,
    type: row.type as Activity['type'],
    user,
    description: row.description,
    timestamp: row.timestamp || new Date().toISOString(),
    entityId: row.entity_id || undefined,
    entityType: row.entity_type as Activity['entityType'] | undefined,
  };
};

// Get all activities
export const getActivities = async (limit = 20): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching activities:', error);
    throw error;
  }

  return Promise.all(data.map(mapToActivity));
};

// Get activities for a specific entity
export const getActivitiesByEntity = async (entityType: Activity['entityType'], entityId: string): Promise<Activity[]> => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error(`Error fetching activities for ${entityType} ${entityId}:`, error);
    throw error;
  }

  return Promise.all(data.map(mapToActivity));
};

// Create a new activity
export const createActivity = async (activity: Omit<Activity, 'id' | 'user'>): Promise<Activity> => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('activities')
    .insert({
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp || new Date().toISOString(),
      entity_id: activity.entityId,
      entity_type: activity.entityType,
      user_id: user?.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating activity:', error);
    throw error;
  }

  return mapToActivity(data);
};
