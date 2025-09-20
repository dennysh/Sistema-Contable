import React from 'react';

const CountDisplay = ({ count, loading = false, fallback = 0 }) => {
  if (loading) {
    return (
      <span className="inline-flex items-center">
        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-1"></div>
        ...
      </span>
    );
  }
  
  return count !== undefined ? count : fallback;
};

export default CountDisplay;
