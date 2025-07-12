'use client';

import React, { useState, useEffect } from 'react';
import { Button, Select } from '@/components/ui';
import { Search, X, SortAsc, SortDesc } from 'lucide-react';
import { SearchState } from '@/types';
import { cn } from '@/utils';

interface SearchBarProps {
  searchState: SearchState;
  onSearchChange: (updates: Partial<SearchState>) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchState,
  onSearchChange,
  className,
}) => {
  const [localQuery, setLocalQuery] = useState(searchState.query);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== searchState.query) {
        onSearchChange({ query: localQuery });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localQuery, searchState.query, onSearchChange]);

  // Update local query when external search state changes
  useEffect(() => {
    setLocalQuery(searchState.query);
  }, [searchState.query]);

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' },
    { value: 'type', label: 'Type' },
  ];

  const handleClearSearch = () => {
    setLocalQuery('');
    onSearchChange({ query: '' });
  };

  const handleSortChange = (sortBy: string) => {
    onSearchChange({ sortBy: sortBy as SearchState['sortBy'] });
  };

  const handleSortOrderToggle = () => {
    onSearchChange({ 
      sortOrder: searchState.sortOrder === 'asc' ? 'desc' : 'asc' 
    });
  };

  return (
    <div className={cn('flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4', className)}>
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-10 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-6 w-6"
            aria-label="Clear search"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Sort Controls */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Select
          options={sortOptions}
          value={searchState.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-28 sm:w-32 text-sm"
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleSortOrderToggle}
          aria-label={`Sort ${searchState.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          className="p-1 sm:p-2"
        >
          {searchState.sortOrder === 'asc' ? (
            <SortAsc className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <SortDesc className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>
      </div>

      {/* Search Results Info */}
      {searchState.query && (
        <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          Searching for &ldquo;{searchState.query}&rdquo;
        </div>
      )}
    </div>
  );
};

export { SearchBar };
