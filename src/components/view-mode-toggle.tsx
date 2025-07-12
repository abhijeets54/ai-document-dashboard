'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Grid3X3, List } from 'lucide-react';
import { cn } from '@/utils';

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  viewMode,
  onViewModeChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center border border-gray-300 dark:border-gray-600 rounded-md', className)}>
      <Button
        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('grid')}
        className="rounded-r-none border-r border-gray-300 dark:border-gray-600 p-1 sm:p-2"
        aria-label="Grid view"
        aria-pressed={viewMode === 'grid'}
      >
        <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('list')}
        className="rounded-l-none p-1 sm:p-2"
        aria-label="List view"
        aria-pressed={viewMode === 'list'}
      >
        <List className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};

export { ViewModeToggle };
