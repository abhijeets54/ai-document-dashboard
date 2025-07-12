'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Document, CreateDocumentRequest, SearchState, PaginationState } from '@/types';
import { filterDocuments, sortDocuments, paginateArray, calculateTotalPages, saveToLocalStorage, loadFromLocalStorage, generateId, generateTags } from '@/utils';

// Mock data for initial documents
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Marketing Strategy Q1 2025',
    type: 'document',
    category: 'business',
    content: 'This comprehensive marketing strategy outlines our approach for Q1 2025, focusing on digital transformation and customer engagement initiatives.',
    createdAt: '2025-01-15T10:30:00Z',
    aiGenerated: true,
    tags: ['marketing', 'strategy', 'Q1']
  },
  {
    id: '2',
    title: 'Product Launch Presentation',
    type: 'slide',
    category: 'business',
    content: 'Slide deck for the upcoming product launch event, including market analysis, product features, and go-to-market strategy.',
    createdAt: '2025-01-14T14:20:00Z',
    aiGenerated: true,
    tags: ['product', 'launch', 'presentation']
  },
  {
    id: '3',
    title: 'Budget Analysis 2025',
    type: 'spreadsheet',
    category: 'business',
    content: 'Detailed financial analysis and budget projections for the fiscal year 2025, including revenue forecasts and expense breakdowns.',
    createdAt: '2025-01-13T09:15:00Z',
    aiGenerated: false,
    tags: ['budget', 'finance', '2025']
  },
  {
    id: '4',
    title: 'Research Paper: AI in Education',
    type: 'document',
    category: 'academic',
    content: 'Academic research paper exploring the impact of artificial intelligence on modern education systems and learning methodologies.',
    createdAt: '2025-01-12T16:45:00Z',
    aiGenerated: true,
    tags: ['AI', 'education', 'research']
  },
  {
    id: '5',
    title: 'Personal Goal Tracker',
    type: 'spreadsheet',
    category: 'personal',
    content: 'Personal goal tracking spreadsheet for 2025, including health, career, and personal development objectives.',
    createdAt: '2025-01-11T11:30:00Z',
    aiGenerated: false,
    tags: ['goals', 'personal', 'tracking']
  }
];

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    filters: {},
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Infinite scroll state
  const [displayedDocuments, setDisplayedDocuments] = useState<Document[]>([]);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerBatch = 12;

  // Keep pagination for compatibility (some components might still use it)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  // Load documents from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDocuments = loadFromLocalStorage<Document[]>('documents', mockDocuments);
      setDocuments(savedDocuments);
    }
  }, []);

  // Save documents to localStorage whenever documents change
  useEffect(() => {
    if (typeof window !== 'undefined' && documents.length > 0) {
      saveToLocalStorage('documents', documents);
    }
  }, [documents]);

  // Calculate filtered and paginated documents
  const filteredAndSortedDocuments = useCallback(() => {
    let filtered = filterDocuments(documents, searchState.filters, searchState.query);
    filtered = sortDocuments(filtered, searchState.sortBy, searchState.sortOrder);
    return filtered;
  }, [documents, searchState]);

  // Update displayed documents for infinite scroll
  useEffect(() => {
    const filtered = filteredAndSortedDocuments();
    const totalItems = filtered.length;
    const totalBatches = Math.ceil(totalItems / itemsPerBatch);

    // Reset when search/filter changes
    setCurrentBatch(1);
    setDisplayedDocuments(filtered.slice(0, itemsPerBatch));
    setHasMore(totalBatches > 1);

    // Update pagination for compatibility
    const totalPages = calculateTotalPages(totalItems, pagination.itemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages,
      currentPage: 1
    }));
  }, [filteredAndSortedDocuments, itemsPerBatch, pagination.itemsPerPage]);

  // Load more documents for infinite scroll
  const loadMoreDocuments = useCallback(() => {
    const filtered = filteredAndSortedDocuments();
    const nextBatch = currentBatch + 1;
    const startIndex = 0;
    const endIndex = nextBatch * itemsPerBatch;

    if (endIndex < filtered.length) {
      setDisplayedDocuments(filtered.slice(startIndex, endIndex));
      setCurrentBatch(nextBatch);
      setHasMore(endIndex < filtered.length);
    } else {
      setDisplayedDocuments(filtered);
      setHasMore(false);
    }
  }, [filteredAndSortedDocuments, currentBatch, itemsPerBatch]);

  // Get paginated documents (for backward compatibility)
  const paginatedDocuments = useMemo(() => {
    const filtered = filteredAndSortedDocuments();
    return paginateArray(filtered, pagination.currentPage, pagination.itemsPerPage);
  }, [filteredAndSortedDocuments, pagination.currentPage, pagination.itemsPerPage]);

  const createDocument = async (request: CreateDocumentRequest): Promise<Document> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call API route to generate content using AI
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate document');
      }

      const newDocument: Document = {
        id: generateId(),
        title: request.title,
        type: request.type,
        category: request.category,
        content: data.content,
        createdAt: new Date().toISOString(),
        aiGenerated: true,
        tags: generateTags(request.title, request.prompt, request.category, request.type)
      };

      setDocuments(prev => [newDocument, ...prev]);
      return newDocument;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create document';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id ? { ...doc, ...updates } : doc
    ));
  };

  const getDocument = (id: string): Document | undefined => {
    return documents.find(doc => doc.id === id);
  };

  const updateSearch = (updates: Partial<SearchState>) => {
    setSearchState(prev => ({ ...prev, ...updates }));
    // Reset to first page when search changes
    if (updates.query !== undefined || updates.filters !== undefined) {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const updatePagination = (updates: Partial<PaginationState>) => {
    setPagination(prev => ({ ...prev, ...updates }));
  };

  const clearError = () => setError(null);

  return {
    // For infinite scroll
    documents: displayedDocuments,
    hasMore,
    loadMoreDocuments,

    // For backward compatibility (pagination)
    paginatedDocuments,
    allDocuments: documents,
    isLoading,
    error,
    searchState,
    pagination,
    createDocument,
    deleteDocument,
    updateDocument,
    getDocument,
    updateSearch,
    updatePagination,
    clearError,
    totalDocuments: documents.length
  };
}
