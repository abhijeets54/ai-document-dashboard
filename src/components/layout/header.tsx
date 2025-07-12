'use client';

import React from 'react';
import { Button } from '@/components/ui';
import { Search, Plus, Moon, Sun, Menu } from 'lucide-react';
import { cn } from '@/utils';

interface HeaderProps {
  onCreateDocument: () => void;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  isDarkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  onCreateDocument,
  onToggleTheme,
  onToggleSidebar,
  isDarkMode,
  searchQuery,
  onSearchChange,
  className,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-700 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60',
        className
      )}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="lg:hidden p-1 sm:p-2"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs sm:text-sm">
                S
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Slideoo
              </h1>
            </div>
          </div>

          {/* Center section - Search (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                aria-label="Search documents"
                role="searchbox"
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleTheme}
              className="p-1 sm:p-2"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>

            <Button
              onClick={onCreateDocument}
              size="sm"
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Document
            </Button>

            <Button
              onClick={onCreateDocument}
              size="sm"
              className="sm:hidden bg-blue-600 hover:bg-blue-700 text-white p-1"
              aria-label="Create document"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
