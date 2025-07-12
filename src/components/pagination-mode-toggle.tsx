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
    <div className={cn('flex items-center space-x-1', className)}>
      <Button
        variant={paginationMode === 'infinite' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onPaginationModeChange('infinite')}
        className="px-2 py-1"
        aria-label="Infinite scroll mode"
        title="Infinite scroll mode"
      >
        <Infinity className="h-4 w-4" />
      </Button>
      <Button
        variant={paginationMode === 'traditional' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => onPaginationModeChange('traditional')}
        className="px-2 py-1"
        aria-label="Traditional pagination mode"
        title="Traditional pagination mode"
      >
        <Hash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export { PaginationModeToggle };
