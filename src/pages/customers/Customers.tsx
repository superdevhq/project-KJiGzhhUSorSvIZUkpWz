
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import { Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getContacts, createContact, updateContact, deleteContact } from '@/services/contactService';
import { useToast } from '@/hooks/use-toast';
import ContactForm from '@/components/customers/ContactForm';
import DeleteContactDialog from '@/components/customers/DeleteContactDialog';
import CustomerViewDialog from '@/components/customers/CustomerViewDialog';

const Customers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State for managing dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Fetch contacts
  const { 
    data: contacts, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts
  });

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: (contactData: any) => {
      // Extract company object for activity description
      const company = contactData.company;
      return createContact({
        ...contactData,
        company: { name: company?.name || 'Unknown Company', id: contactData.company_id }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: 'Contact created',
        description: 'The contact has been successfully created',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating contact',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: any }) => 
      updateContact(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: 'Contact updated',
        description: 'The contact has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating contact',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      toast({
        title: 'Contact deleted',
        description: 'The contact has been successfully deleted',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting contact',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Handle add contact
  const handleAddContact = async (data: any) => {
    await createContactMutation.mutateAsync(data);
  };

  // Handle edit contact
  const handleEditContact = async (data: any) => {
    if (selectedContact) {
      await updateContactMutation.mutateAsync({
        id: selectedContact.id,
        updates: data
      });
    }
  };

  // Handle delete contact
  const handleDeleteContact = async () => {
    if (selectedContact) {
      await deleteContactMutation.mutateAsync(selectedContact.id);
    }
  };

  // Open view dialog
  const openViewDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

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

  // Actions for the dropdown menu in each row
  const rowActions = [
    {
      label: 'View Details',
      onClick: (contact: Contact) => openViewDialog(contact),
    },
    {
      label: 'Edit',
      onClick: (contact: Contact) => openEditDialog(contact),
    },
    {
      label: 'Delete',
      onClick: (contact: Contact) => openDeleteDialog(contact),
      className: 'text-red-600',
    },
  ];

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
          <Button onClick={() => setAddDialogOpen(true)}>
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
            onRowClick={openViewDialog}
            rowActions={rowActions}
          />
        )}

        {/* Add Contact Dialog */}
        <ContactForm
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSubmit={handleAddContact}
          title="Add Customer"
          description="Add a new customer contact to your CRM"
        />

        {/* Edit Contact Dialog */}
        {selectedContact && (
          <ContactForm
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSubmit={handleEditContact}
            contact={selectedContact}
            title="Edit Customer"
            description="Update customer information"
          />
        )}

        {/* View Contact Dialog */}
        <CustomerViewDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          contact={selectedContact}
          onEdit={openEditDialog}
        />

        {/* Delete Contact Dialog */}
        <DeleteContactDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteContact}
          contact={selectedContact}
          isDeleting={deleteContactMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default Customers;
