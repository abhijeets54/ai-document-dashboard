'use client';

import React from 'react';
import { DocumentCard } from './document-card';
import { LoadingSpinner } from '@/components/ui';
import { Document } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText } from 'lucide-react';

interface DocumentGridProps {
  documents: Document[];
  isLoading: boolean;
  onViewDocument: (document: Document) => void;
  onEditDocument?: (document: Document) => void;
  onDeleteDocument: (id: string) => void;
  viewMode?: 'grid' | 'list';
  className?: string;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  isLoading,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  viewMode = 'grid',
  className,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading documents..." />
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No documents found
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm">
          Try adjusting your search criteria or create a new document to get started.
        </p>
      </div>
    );
  }

  const gridClasses = viewMode === 'grid'
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6'
    : 'space-y-3 sm:space-y-4';

  return (
    <div className={`${gridClasses} ${className}`}>
      <AnimatePresence mode="popLayout">
        {documents.map((document) => (
          <motion.div
            key={document.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={viewMode === 'list' ? 'w-full' : ''}
          >
            <DocumentCard
              document={document}
              onView={onViewDocument}
              onEdit={onEditDocument}
              onDelete={onDeleteDocument}
              className={viewMode === 'list' ? 'w-full' : 'h-full'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export { DocumentGrid };
