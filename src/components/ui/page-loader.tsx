
import React from 'react';
import LoadingSpinner from './loading-spinner';

interface PageLoaderProps {
  message?: string;
}

const PageLoader = ({ message = 'Loading...' }: PageLoaderProps) => {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-lg font-medium text-muted-foreground animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default PageLoader;
