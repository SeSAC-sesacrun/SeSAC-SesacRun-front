import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = false, className = '', ...props }, ref) => {
    return (
      <label className={`flex flex-col ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <p className="pb-2 text-sm font-medium leading-normal text-gray-900 dark:text-gray-300">
            {label}
          </p>
        )}
        <div className="relative flex w-full flex-1 items-stretch">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-primary/20'
            } bg-white dark:bg-gray-800 p-[15px] ${
              icon ? 'pl-10' : ''
            } text-base font-normal leading-normal text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-0 focus:ring-2 ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </label>
    );
  }
);

Input.displayName = 'Input';

export default Input;
