
import React from 'react';
import LoadingSpinner from './loading-spinner';

const TableLoader = () => {
  return (
    <div className="flex h-[300px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="md" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  );
};

export default TableLoader;
