import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import LoadingDataTable from '@/components/shared/LoadingDataTable';
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
import { useLoading } from '@/hooks/use-loading';
import PageLoader from '@/components/ui/page-loader';
import { Card, CardContent } from '@/components/ui/card';

const Customers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isLoading, withLoading } = useLoading(true);
  
  // State for managing dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await withLoading(getContacts());
        setContacts(data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch contacts. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchContacts();
  }, [toast, withLoading]);

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

  if (isLoading) {
    return <PageLoader message="Loading customers..." />;
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <LoadingDataTable
            data={contacts}
            columns={columns}
            searchKey="name"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

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
  );
};

export default Customers;