import { renderHook, act, waitFor } from '@testing-library/react';
import { useDocuments } from '../useDocuments';
import { CreateDocumentRequest } from '@/types';

// Mock fetch
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock the utils module
jest.mock('@/utils', () => ({
  ...jest.requireActual('@/utils'),
  loadFromLocalStorage: jest.fn(),
  saveToLocalStorage: jest.fn(),
}));

// Import the mocked functions
import { loadFromLocalStorage, saveToLocalStorage } from '@/utils';

const mockLoadFromLocalStorage = loadFromLocalStorage as jest.MockedFunction<typeof loadFromLocalStorage>;
const mockSaveToLocalStorage = saveToLocalStorage as jest.MockedFunction<typeof saveToLocalStorage>;

describe('useDocuments Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
    localStorageMock.getItem.mockReturnValue(null);
    mockLoadFromLocalStorage.mockClear();
    mockSaveToLocalStorage.mockClear();
  });

  it('initializes with mock documents when localStorage is empty', () => {
    // Mock loadFromLocalStorage to return the default mock documents
    const mockDocuments = [
      {
        id: '1',
        title: 'Marketing Strategy Q1 2025',
        type: 'document' as const,
        category: 'business' as const,
        content: 'This comprehensive marketing strategy outlines our approach for Q1 2025, focusing on digital transformation and customer engagement initiatives.',
        createdAt: '2025-01-15T10:30:00Z',
        aiGenerated: true,
        tags: ['marketing', 'strategy', 'Q1'],
      },
    ];

    mockLoadFromLocalStorage.mockReturnValue(mockDocuments);

    const { result } = renderHook(() => useDocuments());

    // Hook loads mock documents by default when localStorage is empty
    expect(result.current.allDocuments.length).toBeGreaterThan(0);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('loads documents from localStorage on mount', async () => {
    const customDocuments = [
      {
        id: '1',
        title: 'Marketing Strategy Q1 2025',
        type: 'document' as const,
        category: 'business' as const,
        content: 'This comprehensive marketing strategy outlines our approach for Q1 2025, focusing on digital transformation and customer engagement initiatives.',
        createdAt: '2025-01-15T10:30:00Z',
        aiGenerated: true,
        tags: ['marketing', 'strategy', 'Q1'],
      },
    ];

    mockLoadFromLocalStorage.mockReturnValue(customDocuments);

    const { result } = renderHook(() => useDocuments());

    // Wait for the effect to run
    await waitFor(() => {
      // The hook should load the custom documents from localStorage
      expect(result.current.allDocuments.length).toBe(1);
      expect(result.current.allDocuments[0].title).toBe('Marketing Strategy Q1 2025');
    });
  });

  it('creates a new document successfully', async () => {
    // Set up initial mock documents
    const initialDocuments = [
      {
        id: '1',
        title: 'Existing Document',
        type: 'document' as const,
        category: 'business' as const,
        content: 'Existing content',
        createdAt: '2025-01-15T10:30:00Z',
        aiGenerated: true,
        tags: ['existing'],
      },
    ];

    mockLoadFromLocalStorage.mockReturnValue(initialDocuments);

    const mockResponse = {
      success: true,
      content: 'Generated content from AI',
      model: { name: 'Test Model', model: 'test-model', available: true },
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderHook(() => useDocuments());

    const createRequest: CreateDocumentRequest = {
      title: 'New Document',
      type: 'document',
      category: 'business',
      prompt: 'Create a test document',
    };

    await act(async () => {
      await result.current.createDocument(createRequest);
    });

    expect(fetch).toHaveBeenCalledWith('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(createRequest),
    });

    // Should have original mock documents + 1 new document
    expect(result.current.allDocuments.length).toBe(2);
    expect(result.current.allDocuments[0].title).toBe('New Document');
    expect(result.current.allDocuments[0].content).toBe('Generated content from AI');
  });

  it('handles API errors when creating documents', async () => {
    const mockErrorResponse = {
      success: false,
      error: 'API Error',
    };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockErrorResponse,
    });

    const { result } = renderHook(() => useDocuments());

    const createRequest: CreateDocumentRequest = {
      title: 'New Document',
      type: 'document',
      category: 'business',
      prompt: 'Create a test document',
    };

    await act(async () => {
      try {
        await result.current.createDocument(createRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    expect(result.current.error).toBe('API Error');
  });

  it('deletes a document', async () => {
    const mockDocuments = [
      {
        id: '1',
        title: 'Document 1',
        type: 'document' as const,
        category: 'business' as const,
        content: 'Content 1',
        createdAt: '2025-01-15T10:30:00Z',
        aiGenerated: true,
        tags: ['test'],
      },
      {
        id: '2',
        title: 'Document 2',
        type: 'document' as const,
        category: 'business' as const,
        content: 'Content 2',
        createdAt: '2025-01-15T10:30:00Z',
        aiGenerated: true,
        tags: ['test'],
      },
    ];

    mockLoadFromLocalStorage.mockReturnValue(mockDocuments);

    const { result } = renderHook(() => useDocuments());

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.allDocuments).toHaveLength(2);
    });

    act(() => {
      result.current.deleteDocument('1');
    });

    // Wait for the deletion to take effect
    await waitFor(() => {
      expect(result.current.allDocuments).toHaveLength(1);
      expect(result.current.allDocuments[0].id).toBe('2');
    });
  });

  it('updates search query', () => {
    const { result } = renderHook(() => useDocuments());

    act(() => {
      result.current.updateSearch({ query: 'test search' });
    });

    expect(result.current.searchState.query).toBe('test search');
  });

  it('updates filters', () => {
    const { result } = renderHook(() => useDocuments());

    act(() => {
      result.current.updateSearch({ 
        filters: { type: 'document', category: 'business' } 
      });
    });

    expect(result.current.searchState.filters.type).toBe('document');
    expect(result.current.searchState.filters.category).toBe('business');
  });

  it('updates pagination', () => {
    const { result } = renderHook(() => useDocuments());

    act(() => {
      result.current.updatePagination({ currentPage: 2 });
    });

    expect(result.current.pagination.currentPage).toBe(2);
  });

  it('clears error', () => {
    const { result } = renderHook(() => useDocuments());

    // Set an error first
    act(() => {
      result.current.updateSearch({ query: 'test' });
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('gets a specific document by id', async () => {
    const mockDocuments = [
      {
        id: '1',
        title: 'Document 1',
        type: 'document' as const,
        category: 'business' as const,
        content: 'Content 1',
        createdAt: '2025-01-15T10:30:00Z',
        aiGenerated: true,
        tags: ['test'],
      },
    ];

    mockLoadFromLocalStorage.mockReturnValue(mockDocuments);

    const { result } = renderHook(() => useDocuments());

    // Wait for documents to load
    await waitFor(() => {
      expect(result.current.allDocuments.length).toBe(1);
    });

    const document = result.current.getDocument('1');
    expect(document).toEqual(mockDocuments[0]);

    const nonExistentDocument = result.current.getDocument('999');
    expect(nonExistentDocument).toBeUndefined();
  });
});
