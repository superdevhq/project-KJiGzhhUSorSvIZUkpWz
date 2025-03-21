
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import ButtonLoader from './button-loader';

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

const LoadingButton = ({
  isLoading,
  loadingText,
  children,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? <ButtonLoader text={loadingText} /> : children}
    </Button>
  );
};

export default LoadingButton;
