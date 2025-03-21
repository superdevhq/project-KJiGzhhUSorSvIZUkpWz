
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { getCompanies } from '@/services/companyService';

const Companies = () => {
  // Fetch companies
  const { 
    data: companies, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies
  });

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

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 bg-red-50 text-red-800 rounded-md">
          <h3 className="font-semibold">Error loading companies</h3>
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
            <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
            <p className="text-muted-foreground">
              Manage your client companies and organizations
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <DataTable
            data={companies || []}
            columns={columns}
            onRowClick={handleRowClick}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Companies;
