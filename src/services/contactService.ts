
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Contact, Company } from '@/types';

type ContactRow = Database['public']['Tables']['contacts']['Row'];
type CompanyRow = Database['public']['Tables']['companies']['Row'];

// Helper function to map company data
const mapCompany = (row: CompanyRow): Omit<Company, 'contacts'> => ({
  id: row.id,
  name: row.name,
  logo: row.logo || undefined,
  industry: row.industry || 'Unknown',
  website: row.website || undefined,
  size: row.size || undefined,
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString(),
});

// Convert Supabase row to Contact type
const mapToContact = async (row: ContactRow): Promise<Contact> => {
  // Fetch company for this contact
  const { data: companyData, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', row.company_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching company for contact:', error);
  }

  const company = companyData ? {
    ...mapCompany(companyData),
    contacts: [], // Will be populated separately if needed
  } : {
    id: row.company_id || 'unknown',
    name: 'Unknown Company',
    industry: 'Unknown',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    contacts: [],
  };

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    position: row.position || undefined,
    avatar: row.avatar || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    company,
  };
};

// Get all contacts
export const getContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }

  return Promise.all(data.map(mapToContact));
};

// Get contacts for a specific company
export const getContactsByCompany = async (companyId: string): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('company_id', companyId)
    .order('name');

  if (error) {
    console.error(`Error fetching contacts for company ${companyId}:`, error);
    throw error;
  }

  return Promise.all(data.map(mapToContact));
};

// Get a single contact by ID
export const getContactById = async (id: string): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching contact with ID ${id}:`, error);
    throw error;
  }

  return mapToContact(data);
};

// Create a new contact
export const createContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> & { company_id: string }): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      position: contact.position,
      company_id: contact.company_id,
      avatar: contact.avatar,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating contact:', error);
    throw error;
  }

  // Create activity for contact creation
  await supabase
    .from('activities')
    .insert({
      type: 'contact_added',
      description: `Added new contact "${contact.name}" at ${contact.company.name}`,
      entity_id: data.id,
      entity_type: 'contact',
    });

  return mapToContact(data);
};

// Update a contact
export const updateContact = async (id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'company'>> & { company_id?: string }): Promise<Contact> => {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      position: updates.position,
      company_id: updates.company_id,
      avatar: updates.avatar,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }

  return mapToContact(data);
};

// Delete a contact
export const deleteContact = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
};
