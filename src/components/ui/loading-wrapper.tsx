
import React from 'react';
import PageLoader from './page-loader';
import LoadingSpinner from './loading-spinner';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: React.ReactNode;
  fullPage?: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingWrapper = ({
  isLoading,
  children,
  fullPage = false,
  message,
  size = 'md',
}: LoadingWrapperProps) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  if (fullPage) {
    return <PageLoader message={message} />;
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <LoadingSpinner size={size} />
      {message && (
        <p className="ml-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
};

export default LoadingWrapper;
