
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Deal, Company, User } from '@/types';

type DealRow = Database['public']['Tables']['deals']['Row'];
type CompanyRow = Database['public']['Tables']['companies']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Helper function to map company data
const mapCompany = async (companyId: string | null): Promise<Company> => {
  if (!companyId) {
    return {
      id: 'unknown',
      name: 'Unknown Company',
      industry: 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contacts: [],
    };
  }

  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', companyId)
    .single();

  if (error) {
    console.error(`Error fetching company with ID ${companyId}:`, error);
    return {
      id: companyId,
      name: 'Unknown Company',
      industry: 'Unknown',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      contacts: [],
    };
  }

  return {
    id: data.id,
    name: data.name,
    logo: data.logo || undefined,
    industry: data.industry || 'Unknown',
    website: data.website || undefined,
    size: data.size || undefined,
    createdAt: data.created_at || new Date().toISOString(),
    updatedAt: data.updated_at || new Date().toISOString(),
    contacts: [], // Will be populated separately if needed
  };
};

// Helper function to map user data
const mapUser = async (userId: string | null): Promise<User> => {
  if (!userId) {
    return {
      id: 'unknown',
      name: 'Unassigned',
      email: 'unassigned@example.com',
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

// Convert Supabase row to Deal type
const mapToDeal = async (row: DealRow): Promise<Deal> => {
  const company = await mapCompany(row.company_id);
  const assignedTo = await mapUser(row.assigned_to);

  return {
    id: row.id,
    title: row.title,
    value: Number(row.value),
    company,
    stage: row.stage as Deal['stage'],
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    assignedTo,
    description: row.description || undefined,
  };
};

// Get all deals
export const getDeals = async (): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching deals:', error);
    throw error;
  }

  return Promise.all(data.map(mapToDeal));
};

// Get deals by stage
export const getDealsByStage = async (stage: Deal['stage']): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('stage', stage)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching deals for stage ${stage}:`, error);
    throw error;
  }

  return Promise.all(data.map(mapToDeal));
};

// Get deals for a specific company
export const getDealsByCompany = async (companyId: string): Promise<Deal[]> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching deals for company ${companyId}:`, error);
    throw error;
  }

  return Promise.all(data.map(mapToDeal));
};

// Get a single deal by ID
export const getDealById = async (id: string): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching deal with ID ${id}:`, error);
    throw error;
  }

  return mapToDeal(data);
};

// Create a new deal
export const createDeal = async (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> & { company_id: string, assigned_to?: string }): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .insert({
      title: deal.title,
      value: deal.value,
      company_id: deal.company_id,
      stage: deal.stage,
      description: deal.description,
      assigned_to: deal.assigned_to,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating deal:', error);
    throw error;
  }

  // Create activity for deal creation
  await supabase
    .from('activities')
    .insert({
      type: 'deal_created',
      description: `Created a new deal "${deal.title}" with ${deal.company.name}`,
      entity_id: data.id,
      entity_type: 'deal',
    });

  return mapToDeal(data);
};

// Update a deal
export const updateDeal = async (id: string, updates: Partial<Omit<Deal, 'id' | 'createdAt' | 'updatedAt' | 'company' | 'assignedTo'>> & { company_id?: string, assigned_to?: string }): Promise<Deal> => {
  const { data, error } = await supabase
    .from('deals')
    .update({
      title: updates.title,
      value: updates.value,
      company_id: updates.company_id,
      stage: updates.stage,
      description: updates.description,
      assigned_to: updates.assigned_to,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating deal with ID ${id}:`, error);
    throw error;
  }

  // Create activity for deal update
  if (updates.stage) {
    await supabase
      .from('activities')
      .insert({
        type: 'deal_stage_changed',
        description: `Moved "${data.title}" deal to ${updates.stage} stage`,
        entity_id: data.id,
        entity_type: 'deal',
      });
  } else {
    await supabase
      .from('activities')
      .insert({
        type: 'deal_updated',
        description: `Updated deal "${data.title}"`,
        entity_id: data.id,
        entity_type: 'deal',
      });
  }

  return mapToDeal(data);
};

// Delete a deal
export const deleteDeal = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting deal with ID ${id}:`, error);
    throw error;
  }
};
