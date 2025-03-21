
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DataTable from '@/components/shared/DataTable';
import { mockCompanies } from '@/lib/mockData';
import { Company } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const Companies = () => {
  const [companies] = useState<Company[]>(mockCompanies);

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

        <DataTable
          data={companies}
          columns={columns}
          onRowClick={handleRowClick}
        />
      </div>
    </DashboardLayout>
  );
};

export default Companies;
