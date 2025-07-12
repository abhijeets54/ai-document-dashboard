'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter, Badge, Button, useCommonConfirmations } from '@/components/ui';
import { Document } from '@/types';
import { formatRelativeTime, truncateText, getDocumentTypeIcon, getDocumentTypeColor } from '@/utils';
import { MoreVertical, Eye, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';

interface DocumentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete: (id: string) => void;
  className?: string;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  className,
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const [isClicked, setIsClicked] = React.useState(false);
  const { confirmDelete } = useCommonConfirmations();

  const handleView = () => {
    setIsClicked(true);
    // Open modal immediately without delay
    onView(document);
    // Reset the clicked state after animation completes
    setTimeout(() => {
      setIsClicked(false);
    }, 300);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmDelete(document.title);
    if (confirmed) {
      onDelete(document.id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleView();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card
        className={`group relative h-full cursor-pointer transition-all duration-150 hover:shadow-md hover:scale-[1.02] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 ${
          isClicked ? 'scale-[0.98] opacity-90' : ''
        }`}
        tabIndex={0}
        role="button"
        aria-label={`View document: ${document.title}`}
        onKeyDown={handleKeyDown}
        onClick={handleView}
      >
        {/* Header */}
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
              <span className="text-base sm:text-lg flex-shrink-0" role="img" aria-label={`${document.type} icon`}>
                {getDocumentTypeIcon(document.type)}
              </span>
              <h3
                className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate"
                title={document.title}
              >
                {document.title}
              </h3>
            </div>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                aria-label="Document actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
              
              {showActions && (
                <div className="absolute right-0 top-8 z-10 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView();
                        setShowActions(false);
                      }}
                      className="flex w-full items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit();
                          setShowActions(false);
                        }}
                        className="flex w-full items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                        setShowActions(false);
                      }}
                      className="flex w-full items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Badge
              variant="secondary"
              size="sm"
              className={`${getDocumentTypeColor(document.type)} text-xs`}
            >
              {document.type}
            </Badge>
            <Badge variant="secondary" size="sm" className="text-xs">
              {document.category}
            </Badge>
            {document.aiGenerated && (
              <Badge variant="default" size="sm" className="text-xs">
                AI Generated
              </Badge>
            )}
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="pb-2 sm:pb-3">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-3">
            {truncateText(document.content, 120)}
          </p>
        </CardContent>

        {/* Footer */}
        <CardFooter className="pt-2 sm:pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2 sm:gap-0">
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
              {document.tags.length > 2 && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  +{document.tags.length - 2}
                </span>
              )}
            </div>

            <time
              className="text-xs text-gray-500 dark:text-gray-400 self-start sm:self-auto"
              dateTime={document.createdAt}
              title={new Date(document.createdAt).toLocaleString()}
            >
              {formatRelativeTime(document.createdAt)}
            </time>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export { DocumentCard };
