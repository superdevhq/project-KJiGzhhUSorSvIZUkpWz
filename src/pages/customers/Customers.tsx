
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import { mockContacts } from '@/lib/mockData';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const Customers = () => {
  const [contacts] = useState<Contact[]>(mockContacts);

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

        <DataTable
          data={contacts}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>
    </DashboardLayout>
  );
};

export default Customers;
