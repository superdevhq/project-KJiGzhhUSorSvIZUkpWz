
import React from 'react';
import LoadingSpinner from './loading-spinner';

interface ButtonLoaderProps {
  text?: string;
}

const ButtonLoader = ({ text }: ButtonLoaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <LoadingSpinner size="sm" />
      {text && <span>{text}</span>}
    </div>
  );
};

export default ButtonLoader;
