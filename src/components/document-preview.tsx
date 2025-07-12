'use client';

import React from 'react';
import { Modal, Badge, Button, ActionButton, useToast } from '@/components/ui';
import { Document } from '@/types';
import { formatDate, getDocumentTypeIcon, getDocumentTypeColor } from '@/utils';
import { Calendar, Tag, Edit, Download, Share } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const { success, error } = useToast();
  if (!document) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleDownload = () => {
    try {
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

      success('Document downloaded successfully!', `"${document.title}" has been saved to your device.`);
    } catch (error) {
      console.error('Error downloading document:', error);
      error('Failed to download document', 'Please try again or copy the content manually.');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          text: document.content.substring(0, 200) + '...',
          url: window.location.href,
        });
        success('Document shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
        error('Failed to share document', 'Please try again or copy the content manually.');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(
          `${document.title}\n\n${document.content}\n\nShared from Slideoo Dashboard`
        );
        success('Document copied to clipboard!', 'You can now paste it anywhere you like.');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
        error('Failed to copy to clipboard', 'Please try selecting and copying the text manually.');
      }
    }
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={document.title}
      size="xl"
    >
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Document Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between">
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
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <ActionButton
                icon={<Share className="h-4 w-4" />}
                label="Share document"
                onClick={handleShare}
                variant="action"
              />
              <ActionButton
                icon={<Download className="h-4 w-4" />}
                label="Download document"
                onClick={handleDownload}
                variant="action"
              />
            </div>
            {onEdit && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleEdit}
                className="ml-2 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </motion.div>

        {/* Document Metadata */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-4"
        >
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
        </motion.div>

        {/* Document Content */}
        <motion.div 
          variants={itemVariants}
          className="prose prose-sm max-w-none dark:prose-invert"
        >
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-900 dark:text-gray-100">
              {document.content}
            </pre>
          </div>
        </motion.div>

        {/* Document Stats */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700"
        >
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
        </motion.div>
      </motion.div>
    </Modal>
  );
};

export { DocumentPreview };
