
import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import TableLoader from '@/components/ui/table-loader';

interface LoadingDataTableProps {
  isLoading: boolean;
  data: any[];
  columns: any[];
  searchKey?: string;
  [key: string]: any;
}

const LoadingDataTable = ({
  isLoading,
  data,
  columns,
  searchKey,
  ...props
}: LoadingDataTableProps) => {
  if (isLoading) {
    return <TableLoader />;
  }

  return (
    <DataTable
      data={data}
      columns={columns}
      searchKey={searchKey}
      {...props}
    />
  );
};

export default LoadingDataTable;
