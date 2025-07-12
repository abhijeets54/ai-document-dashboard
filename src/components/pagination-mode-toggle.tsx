'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Infinity, Hash } from 'lucide-react';
import { cn } from '@/utils';

interface PaginationModeToggleProps {
  paginationMode: 'infinite' | 'traditional';
  onPaginationModeChange: (mode: 'infinite' | 'traditional') => void;
  className?: string;
}

const PaginationModeToggle: React.FC<PaginationModeToggleProps> = ({
  paginationMode,
  onPaginationModeChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center border border-gray-300 dark:border-gray-600 rounded-md', className)}>
      <Button
        variant={paginationMode === 'infinite' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onPaginationModeChange('infinite')}
        className="rounded-r-none border-r border-gray-300 dark:border-gray-600 p-1 sm:p-2"
        aria-label="Infinite scroll mode"
        title="Infinite scroll mode"
      >
        <Infinity className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <Button
        variant={paginationMode === 'traditional' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onPaginationModeChange('traditional')}
        className="rounded-l-none p-1 sm:p-2"
        aria-label="Traditional pagination mode"
        title="Traditional pagination mode"
      >
        <Hash className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};

export { PaginationModeToggle };
