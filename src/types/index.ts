export interface Document {
  id: string;
  title: string;
  type: 'document' | 'slide' | 'spreadsheet';
  category: 'business' | 'personal' | 'academic';
  content: string;
  createdAt: string;
  aiGenerated: boolean;
  tags: string[];
}

export interface CreateDocumentRequest {
  title: string;
  type: 'document' | 'slide' | 'spreadsheet';
  prompt: string;
  category: 'business' | 'personal' | 'academic';
}

export interface FilterOptions {
  type?: 'document' | 'slide' | 'spreadsheet' | 'all';
  category?: 'business' | 'personal' | 'academic' | 'all';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  viewMode: 'grid' | 'list';
  paginationMode: 'infinite' | 'traditional';
  itemsPerPage: number;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface SearchState {
  query: string;
  filters: FilterOptions;
  sortBy: 'createdAt' | 'title' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AIModel {
  name: string;
  model: string;
  available: boolean;
}
