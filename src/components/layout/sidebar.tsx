'use client';

import React from 'react';
import { Select, Button } from '@/components/ui';
import { FilterOptions } from '@/types';
import { cn } from '@/utils';
import { Filter, X, FileText, Presentation, Table } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  className,
}) => {
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'document', label: 'Documents' },
    { value: 'slide', label: 'Presentations' },
    { value: 'spreadsheet', label: 'Spreadsheets' },
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'personal', label: 'Personal' },
    { value: 'academic', label: 'Academic' },
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.type || filters.category || filters.dateRange;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 sm:w-72 lg:w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200 lg:dark:border-gray-700',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Filter header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Filters
                  </h3>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Document Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Type
                </label>
                <Select
                  options={typeOptions}
                  value={filters.type || 'all'}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <Select
                  options={categoryOptions}
                  value={filters.category || 'all'}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
              </div>

              {/* Quick Stats */}
              <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quick Access
                </h4>
                
                <div className="space-y-2">
                  <button
                    onClick={() => handleFilterChange('type', 'document')}
                    className="flex w-full items-center space-x-3 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Documents</span>
                  </button>
                  
                  <button
                    onClick={() => handleFilterChange('type', 'slide')}
                    className="flex w-full items-center space-x-3 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Presentation className="h-4 w-4" />
                    <span>Presentations</span>
                  </button>
                  
                  <button
                    onClick={() => handleFilterChange('type', 'spreadsheet')}
                    className="flex w-full items-center space-x-3 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <Table className="h-4 w-4" />
                    <span>Spreadsheets</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export { Sidebar };
