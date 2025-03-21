
import { User, Deal, Company, Contact, Activity, DashboardStats } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock Companies
export const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Inc',
    logo: 'https://ui-avatars.com/api/?name=Acme+Inc&background=6366f1&color=fff',
    industry: 'Technology',
    website: 'https://acme.example.com',
    size: '50-100',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-05-20T14:20:00Z',
    contacts: [],
  },
  {
    id: '2',
    name: 'Globex Corporation',
    logo: 'https://ui-avatars.com/api/?name=Globex&background=22c55e&color=fff',
    industry: 'Manufacturing',
    website: 'https://globex.example.com',
    size: '100-500',
    createdAt: '2023-02-10T09:15:00Z',
    updatedAt: '2023-06-05T11:45:00Z',
    contacts: [],
  },
  {
    id: '3',
    name: 'Initech',
    logo: 'https://ui-avatars.com/api/?name=Initech&background=ef4444&color=fff',
    industry: 'Finance',
    website: 'https://initech.example.com',
    size: '10-50',
    createdAt: '2023-03-22T13:40:00Z',
    updatedAt: '2023-04-18T16:30:00Z',
    contacts: [],
  },
  {
    id: '4',
    name: 'Massive Dynamic',
    logo: 'https://ui-avatars.com/api/?name=Massive+Dynamic&background=f59e0b&color=fff',
    industry: 'Research',
    website: 'https://massive.example.com',
    size: '500+',
    createdAt: '2023-01-05T08:20:00Z',
    updatedAt: '2023-05-12T10:10:00Z',
    contacts: [],
  },
  {
    id: '5',
    name: 'Stark Industries',
    logo: 'https://ui-avatars.com/api/?name=Stark+Industries&background=0ea5e9&color=fff',
    industry: 'Technology',
    website: 'https://stark.example.com',
    size: '500+',
    createdAt: '2022-11-30T15:45:00Z',
    updatedAt: '2023-06-01T09:30:00Z',
    contacts: [],
  },
];

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Brown',
    email: 'alice@acme.example.com',
    phone: '+1 (555) 123-4567',
    position: 'CTO',
    company: mockCompanies[0],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2023-02-10T11:30:00Z',
    updatedAt: '2023-05-22T14:20:00Z',
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob@globex.example.com',
    phone: '+1 (555) 234-5678',
    position: 'CEO',
    company: mockCompanies[1],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2023-03-15T09:45:00Z',
    updatedAt: '2023-06-01T16:30:00Z',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@initech.example.com',
    phone: '+1 (555) 345-6789',
    position: 'CFO',
    company: mockCompanies[2],
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2023-01-20T13:15:00Z',
    updatedAt: '2023-04-25T10:10:00Z',
  },
  {
    id: '4',
    name: 'David Miller',
    email: 'david@massive.example.com',
    phone: '+1 (555) 456-7890',
    position: 'CIO',
    company: mockCompanies[3],
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2023-02-28T15:30:00Z',
    updatedAt: '2023-05-15T11:45:00Z',
  },
  {
    id: '5',
    name: 'Eva Green',
    email: 'eva@stark.example.com',
    phone: '+1 (555) 567-8901',
    position: 'COO',
    company: mockCompanies[4],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    createdAt: '2023-03-10T10:20:00Z',
    updatedAt: '2023-06-05T14:15:00Z',
  },
];

// Update companies with contacts
mockCompanies.forEach((company, index) => {
  company.contacts = mockContacts.filter(contact => contact.company.id === company.id);
});

// Mock Deals
export const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise Software Solution',
    value: 75000,
    company: mockCompanies[0],
    stage: 'proposal',
    createdAt: '2023-04-10T09:30:00Z',
    updatedAt: '2023-06-01T14:20:00Z',
    assignedTo: mockUsers[0],
    description: 'Custom enterprise software solution for internal operations.',
  },
  {
    id: '2',
    title: 'Manufacturing Equipment',
    value: 120000,
    company: mockCompanies[1],
    stage: 'negotiation',
    createdAt: '2023-03-15T11:45:00Z',
    updatedAt: '2023-05-20T16:30:00Z',
    assignedTo: mockUsers[1],
    description: 'New manufacturing equipment for production line expansion.',
  },
  {
    id: '3',
    title: 'Financial Consulting',
    value: 45000,
    company: mockCompanies[2],
    stage: 'won',
    createdAt: '2023-02-20T13:15:00Z',
    updatedAt: '2023-04-25T10:10:00Z',
    assignedTo: mockUsers[2],
    description: 'Quarterly financial consulting services.',
  },
  {
    id: '4',
    title: 'Research Partnership',
    value: 250000,
    company: mockCompanies[3],
    stage: 'lead',
    createdAt: '2023-05-05T15:30:00Z',
    updatedAt: '2023-06-10T11:45:00Z',
    assignedTo: mockUsers[0],
    description: 'Joint research partnership for new technology development.',
  },
  {
    id: '5',
    title: 'Technology Licensing',
    value: 180000,
    company: mockCompanies[4],
    stage: 'contact',
    createdAt: '2023-04-28T10:20:00Z',
    updatedAt: '2023-06-05T14:15:00Z',
    assignedTo: mockUsers[1],
    description: 'Licensing agreement for proprietary technology.',
  },
  {
    id: '6',
    title: 'Software Upgrade',
    value: 35000,
    company: mockCompanies[0],
    stage: 'proposal',
    createdAt: '2023-05-12T09:30:00Z',
    updatedAt: '2023-06-15T14:20:00Z',
    assignedTo: mockUsers[2],
    description: 'Upgrade of existing software systems to latest version.',
  },
  {
    id: '7',
    title: 'Supply Chain Optimization',
    value: 85000,
    company: mockCompanies[1],
    stage: 'lost',
    createdAt: '2023-03-25T11:45:00Z',
    updatedAt: '2023-05-30T16:30:00Z',
    assignedTo: mockUsers[0],
    description: 'Supply chain optimization consulting project.',
  },
  {
    id: '8',
    title: 'Investment Advisory',
    value: 60000,
    company: mockCompanies[2],
    stage: 'negotiation',
    createdAt: '2023-04-15T13:15:00Z',
    updatedAt: '2023-06-20T10:10:00Z',
    assignedTo: mockUsers[1],
    description: 'Investment advisory services for new market expansion.',
  },
];

// Mock Activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'deal_created',
    user: mockUsers[0],
    description: 'Created a new deal "Enterprise Software Solution" with Acme Inc',
    timestamp: '2023-04-10T09:30:00Z',
    entityId: '1',
    entityType: 'deal',
  },
  {
    id: '2',
    type: 'deal_stage_changed',
    user: mockUsers[1],
    description: 'Moved "Manufacturing Equipment" deal to Negotiation stage',
    timestamp: '2023-05-20T16:30:00Z',
    entityId: '2',
    entityType: 'deal',
  },
  {
    id: '3',
    type: 'deal_updated',
    user: mockUsers[2],
    description: 'Updated deal value for "Financial Consulting" to $45,000',
    timestamp: '2023-04-25T10:10:00Z',
    entityId: '3',
    entityType: 'deal',
  },
  {
    id: '4',
    type: 'contact_added',
    user: mockUsers[0],
    description: 'Added new contact "David Miller" at Massive Dynamic',
    timestamp: '2023-02-28T15:30:00Z',
    entityId: '4',
    entityType: 'contact',
  },
  {
    id: '5',
    type: 'company_added',
    user: mockUsers[1],
    description: 'Added new company "Stark Industries"',
    timestamp: '2022-11-30T15:45:00Z',
    entityId: '5',
    entityType: 'company',
  },
  {
    id: '6',
    type: 'deal_stage_changed',
    user: mockUsers[2],
    description: 'Moved "Financial Consulting" deal to Won stage',
    timestamp: '2023-04-25T10:10:00Z',
    entityId: '3',
    entityType: 'deal',
  },
  {
    id: '7',
    type: 'deal_created',
    user: mockUsers[0],
    description: 'Created a new deal "Research Partnership" with Massive Dynamic',
    timestamp: '2023-05-05T15:30:00Z',
    entityId: '4',
    entityType: 'deal',
  },
  {
    id: '8',
    type: 'contact_added',
    user: mockUsers[1],
    description: 'Added new contact "Eva Green" at Stark Industries',
    timestamp: '2023-03-10T10:20:00Z',
    entityId: '5',
    entityType: 'contact',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalDeals: mockDeals.length,
  totalValue: mockDeals.reduce((sum, deal) => sum + deal.value, 0),
  wonDeals: mockDeals.filter(deal => deal.stage === 'won').length,
  wonValue: mockDeals.filter(deal => deal.stage === 'won').reduce((sum, deal) => sum + deal.value, 0),
  newLeads: mockDeals.filter(deal => deal.stage === 'lead').length,
  conversionRate: Math.round((mockDeals.filter(deal => deal.stage === 'won').length / mockDeals.length) * 100),
};

// Mock Authentication Functions
export const mockLogin = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password') {
        resolve(mockUsers[0]);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
};

export const mockRegister = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '4',
        name,
        email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
      });
    }, 800);
  });
};

export const mockForgotPassword = (email: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 800);
  });
};
