'use client';

import React, { useState } from 'react';
import { Header, Sidebar } from '@/components/layout';
import { DocumentGrid } from '@/components/document-grid';
import { DocumentPreview } from '@/components/document-preview';
import { CreateDocumentModal } from '@/components/forms';
import { SearchBar } from '@/components/search-bar';

import { ViewModeToggle } from '@/components/view-mode-toggle';
import { PaginationModeToggle } from '@/components/pagination-mode-toggle';
import { Pagination } from '@/components/pagination';

import { useDocuments, useUserPreferences, useInfiniteScroll } from '@/hooks';
import { Document, FilterOptions, SearchState, CreateDocumentRequest } from '@/types';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { success, error: showErrorToast } = useToast();

  const {
    documents,
    paginatedDocuments,
    hasMore,
    loadMoreDocuments,
    isLoading,
    error,
    searchState,
    pagination,
    createDocument,
    deleteDocument,
    updateSearch,
    updatePagination,
    clearError,
    totalDocuments
  } = useDocuments();

  const {
    preferences,
    toggleTheme,
    setViewMode,
    setPaginationMode,
    isDarkMode
  } = useUserPreferences();

  // Infinite scroll setup (only when using infinite pagination)
  const { loadMoreRef } = useInfiniteScroll(
    loadMoreDocuments,
    hasMore && !isLoading && preferences.paginationMode === 'infinite'
  );

  // Determine which documents to display based on pagination mode
  const displayDocuments = preferences.paginationMode === 'infinite' ? documents : paginatedDocuments;

  const handleCreateDocument = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDeleteDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    deleteDocument(id);
    success('Document deleted', document ? `"${document.title}" has been deleted successfully.` : 'Document has been deleted successfully.');
  };

  const handleSearchChange = (query: string) => {
    updateSearch({ query });
  };

  const handleFiltersChange = (filters: FilterOptions) => {
    updateSearch({ filters });
  };

  const handleSearchStateChange = (updates: Partial<SearchState>) => {
    updateSearch(updates);
  };



  const handleCreateSubmit = async (request: CreateDocumentRequest) => {
    try {
      const newDocument = await createDocument(request);
      success('Document created successfully!', `"${newDocument.title}" has been generated and added to your collection.`);
      setIsCreateModalOpen(false);
    } catch (error) {
      showErrorToast('Failed to create document', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        onCreateDocument={handleCreateDocument}
        onToggleTheme={toggleTheme}
        onToggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        searchQuery={searchState.query}
        onSearchChange={handleSearchChange}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          filters={searchState.filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-w-0">
          <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">


            {/* Controls Bar */}
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <SearchBar
                  searchState={searchState}
                  onSearchChange={handleSearchStateChange}
                />
              </div>

              <div className="flex flex-wrap items-center gap-y-2 justify-between sm:justify-end sm:ml-4">
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mr-4 sm:mr-6">
                  {totalDocuments} documents
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4">
                  <PaginationModeToggle
                    paginationMode={preferences.paginationMode}
                    onPaginationModeChange={setPaginationMode}
                    className="shrink-0"
                  />

                  <ViewModeToggle
                    viewMode={preferences.viewMode}
                    onViewModeChange={setViewMode}
                    className="shrink-0"
                  />
                </div>
              </div>
            </div>

            {/* Document Grid */}
            <DocumentGrid
              documents={displayDocuments}
              isLoading={isLoading}
              onViewDocument={handleViewDocument}
              onDeleteDocument={handleDeleteDocument}
              viewMode={preferences.viewMode}
            />

            {/* Infinite Scroll Trigger */}
            {preferences.paginationMode === 'infinite' && hasMore && (
              <div
                ref={loadMoreRef}
                className="flex items-center justify-center py-8"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                    <span>Loading more documents...</span>
                  </div>
                ) : (
                  <div className="text-gray-400 dark:text-gray-500 text-sm">
                    Scroll down to load more documents
                  </div>
                )}
              </div>
            )}

            {/* Traditional Pagination */}
            {preferences.paginationMode === 'traditional' && (
              <div className="mt-8">
                <Pagination
                  pagination={pagination}
                  onPageChange={(page) => updatePagination({ currentPage: page })}
                />
              </div>
            )}

            {/* End of results indicator for infinite scroll */}
            {preferences.paginationMode === 'infinite' && !hasMore && documents.length > 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-400 dark:text-gray-500 text-sm">
                  You've reached the end of the documents
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <CreateDocumentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={isLoading}
      />

      <DocumentPreview
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
