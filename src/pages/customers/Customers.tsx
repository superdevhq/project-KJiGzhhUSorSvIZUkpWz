
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getContacts } from '@/services/contactService';

const Customers = () => {
  // Fetch contacts
  const { 
    data: contacts, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts
  });

  const columns = [
    {
      header: 'Name',
      accessorKey: 'name' as keyof Contact,
      cell: (contact: Contact) => (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{contact.name}</div>
            <div className="text-xs text-muted-foreground">{contact.email}</div>
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Company',
      accessorKey: 'company' as keyof Contact,
      cell: (contact: Contact) => (
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={contact.company.logo} alt={contact.company.name} />
            <AvatarFallback>{contact.company.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{contact.company.name}</span>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Position',
      accessorKey: 'position' as keyof Contact,
      cell: (contact: Contact) => (
        contact.position ? (
          <Badge variant="outline" className="font-normal">
            {contact.position}
          </Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      ),
      sortable: true,
    },
    {
      header: 'Phone',
      accessorKey: 'phone' as keyof Contact,
      cell: (contact: Contact) => contact.phone || <span className="text-muted-foreground">-</span>,
      sortable: true,
    },
    {
      header: 'Created',
      accessorKey: 'createdAt' as keyof Contact,
      cell: (contact: Contact) => formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true }),
      sortable: true,
    },
  ];

  const handleRowClick = (contact: Contact) => {
    console.log('View contact details:', contact);
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h3 className="font-semibold">Error loading customers</h3>
          <p>Please try refreshing the page.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customer contacts and relationships
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DataTable
            data={contacts || []}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Customers;
