import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent" style={{ borderTopColor: '#C5F135' }}></div>
    </div>
  );
};

export default LoadingSpinner;

