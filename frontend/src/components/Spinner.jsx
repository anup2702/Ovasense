import React from 'react';

const Spinner = ({ size = 'medium', color = 'indigo' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    indigo: 'border-indigo-500',
    purple: 'border-purple-500',
    white: 'border-white'
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-slate-200 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
