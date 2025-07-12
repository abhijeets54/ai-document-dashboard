import React from 'react';
import { cn } from '@/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'action' | 'close';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95 dark:bg-blue-700 dark:hover:bg-blue-800',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-sm active:scale-95 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 hover:border-gray-400 hover:shadow-sm active:scale-95 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:border-gray-500',
      ghost: 'hover:bg-gray-100 hover:shadow-sm active:scale-95 dark:hover:bg-gray-800',
      destructive: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-md active:scale-95 dark:bg-red-700 dark:hover:bg-red-800',
      action: 'bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 hover:shadow-lg hover:scale-105 active:scale-95 dark:bg-gray-800/90 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:border-gray-600',
      close: 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-lg hover:scale-110 active:scale-95 dark:bg-gray-800/80 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
