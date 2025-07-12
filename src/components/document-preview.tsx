'use client';

import React from 'react';
import { Modal, Badge, Button } from '@/components/ui';
import { Document } from '@/types';
import { formatDate, getDocumentTypeIcon, getDocumentTypeColor } from '@/utils';
import { Calendar, Tag, Edit, Download, Share } from 'lucide-react';

interface DocumentPreviewProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (document: Document) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!document) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleDownload = () => {
    // Create a blob with the document content
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // Create a temporary link and trigger download
    const link = window.document.createElement('a');
    link.href = url;
    link.download = `${document.title}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);

    // Clean up the URL
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.content.substring(0, 200) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${document.title}\n\n${document.content}\n\nShared from Slideoo Dashboard`
        );
        alert('Document content copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      size="xl"
    >
      <div className="space-y-6">
        {/* Document Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl" role="img" aria-label={`${document.type} icon`}>
              {getDocumentTypeIcon(document.type)}
            </span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {document.title}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className={getDocumentTypeColor(document.type)}
                >
                  {document.type}
                </Badge>
                <Badge variant="secondary">
                  {document.category}
                </Badge>
                {document.aiGenerated && (
                  <Badge variant="default">
                    AI Generated
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              aria-label="Share document"
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              aria-label="Download document"
            >
              <Download className="h-4 w-4" />
            </Button>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Document Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(document.createdAt)}</span>
          </div>
          
          {document.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span>Tags:</span>
              <div className="flex flex-wrap gap-1">
                {document.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Document Content */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900 dark:text-gray-100">
              {document.content}
            </pre>
          </div>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {document.content.split(' ').length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Words</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {document.content.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.ceil(document.content.split(' ').length / 200)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Est. Reading Time (min)</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { DocumentPreview };
