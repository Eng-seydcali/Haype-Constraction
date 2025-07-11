import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 24, className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`animate-spin w-${size} h-${size} text-blue-600`} />
    </div>
  );
};

export default LoadingSpinner;