'use client';

import { useState, useEffect } from 'react';
import { UserPreferences } from '@/types';
import { saveToLocalStorage, loadFromLocalStorage, defaultUserPreferences } from '@/utils';

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultUserPreferences);

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreferences = loadFromLocalStorage<UserPreferences>('userPreferences', defaultUserPreferences);
      setPreferences(savedPreferences);

      // Apply theme to document
      if (savedPreferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Save preferences to localStorage and apply theme whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only save if preferences are different from default (to avoid saving on initial load)
      if (preferences !== defaultUserPreferences) {
        saveToLocalStorage('userPreferences', preferences);
      }

      // Apply theme to document
      if (preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    setPreferences(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const setViewMode = (viewMode: 'grid' | 'list') => {
    setPreferences(prev => ({ ...prev, viewMode }));
  };

  const setPaginationMode = (paginationMode: 'infinite' | 'traditional') => {
    setPreferences(prev => ({ ...prev, paginationMode }));
  };

  const setItemsPerPage = (itemsPerPage: number) => {
    setPreferences(prev => ({ ...prev, itemsPerPage }));
  };

  return {
    preferences,
    updatePreferences,
    toggleTheme,
    setViewMode,
    setPaginationMode,
    setItemsPerPage,
    isDarkMode: preferences.theme === 'dark'
  };
}
