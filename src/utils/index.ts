import { type ClassValue, clsx } from 'clsx';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { Document, FilterOptions, UserPreferences } from '@/types';

// Utility for combining class names
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Date formatting utilities
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return format(dateObj, 'MMM dd, yyyy');
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return 'Invalid date';
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Document filtering utilities
export function filterDocuments(documents: Document[], filters: FilterOptions, searchQuery: string = ''): Document[] {
  return documents.filter(doc => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesSearch) return false;
    }

    // Type filter
    if (filters.type && filters.type !== 'all' && doc.type !== filters.type) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'all' && doc.category !== filters.category) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const docDate = parseISO(doc.createdAt);
      if (isValid(docDate)) {
        if (docDate < filters.dateRange.start || docDate > filters.dateRange.end) {
          return false;
        }
      }
    }

    return true;
  });
}

// Sorting utilities
export function sortDocuments(documents: Document[], sortBy: string, sortOrder: 'asc' | 'desc'): Document[] {
  return [...documents].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
}

// Pagination utilities
export function paginateArray<T>(array: T[], page: number, itemsPerPage: number): T[] {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
}

export function calculateTotalPages(totalItems: number, itemsPerPage: number): number {
  return Math.ceil(totalItems / itemsPerPage);
}

// Local storage utilities
export function saveToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

// Document type utilities
export function getDocumentTypeIcon(type: string): string {
  switch (type) {
    case 'document':
      return '📄';
    case 'slide':
      return '📊';
    case 'spreadsheet':
      return '📈';
    default:
      return '📄';
  }
}

export function getDocumentTypeColor(type: string): string {
  switch (type) {
    case 'document':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'slide':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'spreadsheet':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Smart tag generation utilities
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it',
  'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'the', 'this', 'but', 'they',
  'have', 'had', 'what', 'said', 'each', 'which', 'their', 'time', 'if', 'up', 'out', 'many',
  'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'into', 'him', 'two',
  'more', 'very', 'what', 'know', 'just', 'first', 'get', 'over', 'think', 'also', 'your',
  'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before',
  'here', 'through', 'when', 'where', 'how', 'all', 'any', 'may', 'say', 'there', 'use', 'her',
  'than', 'she', 'well', 'other', 'create', 'generate', 'write', 'make', 'design', 'build'
]);

export function generateTags(title: string, prompt: string, category: string, type: string): string[] {
  const tags = new Set<string>();

  // Extract meaningful words from title (highest priority)
  const titleWords = extractMeaningfulWords(title);
  titleWords.slice(0, 2).forEach(word => tags.add(word));

  // Extract meaningful words from prompt
  const promptWords = extractMeaningfulWords(prompt);
  promptWords.slice(0, 3).forEach(word => tags.add(word));

  // Add category and type as potential tags
  if (category !== 'personal') tags.add(category);
  if (type !== 'document') tags.add(type);

  // Convert to array and limit to 5 tags max
  return Array.from(tags).slice(0, 5);
}

function extractMeaningfulWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/) // Split on whitespace
    .filter(word =>
      word.length >= 3 && // At least 3 characters
      word.length <= 15 && // Not too long
      !STOP_WORDS.has(word) && // Not a stop word
      !/^\d+$/.test(word) // Not just numbers
    )
    .slice(0, 10); // Limit processing
}

// Default user preferences
export const defaultUserPreferences: UserPreferences = {
  theme: 'light',
  viewMode: 'grid',
  paginationMode: 'infinite',
  itemsPerPage: 12,
};
