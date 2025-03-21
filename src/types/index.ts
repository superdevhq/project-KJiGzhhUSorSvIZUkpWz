
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  company: Company;
  stage: 'lead' | 'contact' | 'proposal' | 'negotiation' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
  assignedTo: User;
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  industry: string;
  website?: string;
  size?: string;
  createdAt: string;
  updatedAt: string;
  contacts: Contact[];
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  company: Company;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: 'deal_created' | 'deal_updated' | 'deal_stage_changed' | 'contact_added' | 'company_added';
  user: User;
  description: string;
  timestamp: string;
  entityId?: string;
  entityType?: 'deal' | 'contact' | 'company';
}

export interface DashboardStats {
  totalDeals: number;
  totalValue: number;
  wonDeals: number;
  wonValue: number;
  newLeads: number;
  conversionRate: number;
}
