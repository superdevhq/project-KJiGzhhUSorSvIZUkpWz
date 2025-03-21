import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '@/services/companyService';
import { useToast } from '@/hooks/use-toast';
import CompanyForm from '@/components/companies/CompanyForm';
import DeleteCompanyDialog from '@/components/companies/DeleteCompanyDialog';
import LoadingDataTable from '@/components/shared/LoadingDataTable';
import { useLoading } from '@/hooks/use-loading';
import PageLoader from '@/components/ui/page-loader';

const Companies = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State for managing dialogs
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { isLoading, withLoading } = useLoading(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await withLoading(getCompanies());
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch companies. Please try again.',
          variant: 'destructive',
        });
      }
    };

    fetchCompanies();
  }, [toast, withLoading]);

  // Create company mutation
  const createCompanyMutation = useMutation({
    mutationFn: (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'contacts'>) => 
      createCompany(companyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Company created',
        description: 'The company has been successfully created',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error creating company',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Update company mutation
  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Omit<Company, 'id' | 'createdAt' | 'updatedAt' | 'contacts'>> }) => 
      updateCompany(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Company updated',
        description: 'The company has been successfully updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error updating company',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Delete company mutation
  const deleteCompanyMutation = useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast({
        title: 'Company deleted',
        description: 'The company has been successfully deleted',
      });
      setDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting company',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });

  // Handle add company
  const handleAddCompany = async (data: any) => {
    await createCompanyMutation.mutateAsync(data);
  };

  // Handle edit company
  const handleEditCompany = async (data: any) => {
    if (selectedCompany) {
      await updateCompanyMutation.mutateAsync({
        id: selectedCompany.id,
        updates: data,
      });
    }
  };

  // Handle delete company
  const handleDeleteCompany = async () => {
    if (selectedCompany) {
      await deleteCompanyMutation.mutateAsync(selectedCompany.id);
    }
  };

  // Open edit dialog
  const openEditDialog = (company: Company) => {
    setSelectedCompany(company);
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (company: Company) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const columns = [
    {
      header: 'Company',
      accessorKey: 'name' as keyof Company,
      cell: (company: Company) => (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={company.logo} alt={company.name} />
            <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{company.name}</div>
            {company.website && (
              <div className="text-xs text-muted-foreground">
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {company.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      header: 'Industry',
      accessorKey: 'industry' as keyof Company,
      cell: (company: Company) => (
        <Badge variant="outline" className="font-normal">
          {company.industry}
        </Badge>
      ),
      sortable: true,
    },
    {
      header: 'Size',
      accessorKey: 'size' as keyof Company,
      sortable: true,
    },
    {
      header: 'Contacts',
      accessorKey: 'contacts' as keyof Company,
      cell: (company: Company) => company.contacts.length,
      sortable: true,
    },
    {
      header: 'Created',
      accessorKey: 'createdAt' as keyof Company,
      cell: (company: Company) => formatDistanceToNow(new Date(company.createdAt), { addSuffix: true }),
      sortable: true,
    },
  ];

  const handleRowClick = (company: Company) => {
    console.log('View company details:', company);
  };

  // Actions for the dropdown menu in each row
  const rowActions = [
    {
      label: 'Edit',
      onClick: (company: Company) => openEditDialog(company),
    },
    {
      label: 'Delete',
      onClick: (company: Company) => openDeleteDialog(company),
      className: 'text-red-600',
    },
  ];

  if (isLoading) {
    return <PageLoader message="Loading companies..." />;
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Companies</h1>
          <p className="text-muted-foreground">
            Manage your company relationships
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <LoadingDataTable
            data={companies || []}
            columns={columns}
            searchKey="name"
            isLoading={isLoading}
          />
        </CardContent>
      </Card>

      {/* Add Company Dialog */}
      <CompanyForm
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddCompany}
        title="Add Company"
        description="Add a new company to your CRM"
      />

      {/* Edit Company Dialog */}
      {selectedCompany && (
        <CompanyForm
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSubmit={handleEditCompany}
          company={selectedCompany}
          title="Edit Company"
          description="Update company information"
        />
      )}

      {/* Delete Company Dialog */}
      <DeleteCompanyDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteCompany}
        company={selectedCompany}
        isDeleting={deleteCompanyMutation.isPending}
      />
    </div>
  );
};

export default Companies;