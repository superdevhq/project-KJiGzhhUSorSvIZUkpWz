
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Company } from '@/types';

type CompanyRow = Database['public']['Tables']['companies']['Row'];
type ContactRow = Database['public']['Tables']['contacts']['Row'];

// Convert Supabase row to Company type
const mapToCompany = async (row: CompanyRow): Promise<Company> => {
  // Fetch contacts for this company
  const { data: contactsData } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', row.id);

  const contacts = contactsData ? contactsData.map(contact => ({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone || undefined,
    position: contact.position || undefined,
    avatar: contact.avatar || undefined,
    createdAt: contact.created_at || new Date().toISOString(),
    updatedAt: contact.updated_at || new Date().toISOString(),
    company: {
      id: row.id,
      name: row.name,
      logo: row.logo || undefined,
      industry: row.industry || 'Unknown',
      website: row.website || undefined,
      size: row.size || undefined,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || new Date().toISOString(),
      contacts: [],
    },
  })) : [];

  return {
    id: row.id,
    name: row.name,
    logo: row.logo || undefined,
    industry: row.industry || 'Unknown',
    website: row.website || undefined,
    size: row.size || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    contacts,
  };
};

// Get all companies
export const getCompanies = async (): Promise<Company[]> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }

  return Promise.all(data.map(mapToCompany));
};

// Get a single company by ID
export const getCompanyById = async (id: string): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching company with ID ${id}:`, error);
    throw error;
  }

  return mapToCompany(data);
};

// Create a new company
export const createCompany = async (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'contacts'>): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .insert({
      name: company.name,
      logo: company.logo,
      industry: company.industry,
      website: company.website,
      size: company.size,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating company:', error);
    throw error;
  }

  // Create activity for company creation
  await supabase
    .from('activities')
    .insert({
      type: 'company_added',
      description: `Added new company "${company.name}"`,
      entity_id: data.id,
      entity_type: 'company',
    });

  return mapToCompany(data);
};

// Update a company
export const updateCompany = async (id: string, updates: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'contacts'>>): Promise<Company> => {
  const { data, error } = await supabase
    .from('companies')
    .update({
      name: updates.name,
      logo: updates.logo,
      industry: updates.industry,
      website: updates.website,
      size: updates.size,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating company with ID ${id}:`, error);
    throw error;
  }

  return mapToCompany(data);
};

// Delete a company
export const deleteCompany = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting company with ID ${id}:`, error);
    throw error;
  }
};
