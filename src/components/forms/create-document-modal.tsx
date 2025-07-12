'use client';

import React, { useState } from 'react';
import { Modal, Button, Input, Select, Textarea, useToast } from '@/components/ui';
import { CreateDocumentRequest } from '@/types';
import { Sparkles } from 'lucide-react';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: CreateDocumentRequest) => Promise<void>;
  isLoading: boolean;
}

const CreateDocumentModal: React.FC<CreateDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CreateDocumentRequest>({
    title: '',
    type: 'document',
    prompt: '',
    category: 'business',
  });
  const [errors, setErrors] = useState<Partial<CreateDocumentRequest>>({});
  const { warning } = useToast();

  const typeOptions = [
    { value: 'document', label: 'Document' },
    { value: 'slide', label: 'Presentation' },
    { value: 'spreadsheet', label: 'Spreadsheet' },
  ];

  const categoryOptions = [
    { value: 'business', label: 'Business' },
    { value: 'personal', label: 'Personal' },
    { value: 'academic', label: 'Academic' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateDocumentRequest> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.prompt.trim()) {
      newErrors.prompt = 'AI prompt is required';
    } else if (formData.prompt.trim().length < 10) {
      newErrors.prompt = 'Prompt should be at least 10 characters long';
    }

    setErrors(newErrors);

    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      warning('Please fix the form errors', 'Check the highlighted fields and try again.');
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        title: '',
        type: 'document',
        prompt: '',
        category: 'business',
      });
      setErrors({});
      onClose();
    } catch (error) {
      // Error is handled by the parent component
      console.error('Error creating document:', error);
    }
  };

  const handleInputChange = (field: keyof CreateDocumentRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        title: '',
        type: 'document',
        prompt: '',
        category: 'business',
      });
      setErrors({});
      onClose();
    }
  };

  const getPromptPlaceholder = () => {
    switch (formData.type) {
      case 'document':
        return 'e.g., "Write a comprehensive marketing strategy for a tech startup focusing on social media and content marketing"';
      case 'slide':
        return 'e.g., "Create a presentation about the benefits of renewable energy with key statistics and actionable insights"';
      case 'spreadsheet':
        return 'e.g., "Generate a budget tracking template with categories for income, expenses, and savings goals"';
      default:
        return 'Describe what you want the AI to create for you...';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Document"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <Input
          label="Document Title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Enter a descriptive title for your document"
          error={errors.title}
          disabled={isLoading}
          required
        />

        {/* Type and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Document Type"
            options={typeOptions}
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value as CreateDocumentRequest['type'])}
            disabled={isLoading}
            required
          />

          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value as CreateDocumentRequest['category'])}
            disabled={isLoading}
            required
          />
        </div>

        {/* AI Prompt */}
        <Textarea
          label="AI Prompt"
          value={formData.prompt}
          onChange={(e) => handleInputChange('prompt', e.target.value)}
          placeholder={getPromptPlaceholder()}
          error={errors.prompt}
          disabled={isLoading}
          rows={4}
          helperText="Describe what you want the AI to create. Be specific for better results."
          required
        />

        {/* AI Model Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              AI-Powered Generation
            </h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Your document will be generated using advanced AI models with automatic fallback 
            to ensure the best possible results. The more detailed your prompt, the better 
            the output will be.
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Document'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export { CreateDocumentModal };
