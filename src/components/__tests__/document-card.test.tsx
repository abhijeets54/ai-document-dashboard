import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentCard } from '../document-card';
import { Document } from '@/types';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
}));

const mockDocument: Document = {
  id: '1',
  title: 'Test Document',
  type: 'document',
  category: 'business',
  content: 'This is a test document content that should be displayed in the card.',
  createdAt: '2025-01-15T10:30:00Z',
  aiGenerated: true,
  tags: ['test', 'document'],
};

describe('DocumentCard Component', () => {
  const mockOnView = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders document information correctly', () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Document')).toBeInTheDocument();
    expect(screen.getByText('document')).toBeInTheDocument();
    expect(screen.getByText('business')).toBeInTheDocument();
    expect(screen.getByText('AI Generated')).toBeInTheDocument();
    expect(screen.getByText('#test')).toBeInTheDocument();
    expect(screen.getByText('#document')).toBeInTheDocument();
  });

  it('calls onView when card is clicked', () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /view document: test document/i }));
    expect(mockOnView).toHaveBeenCalledWith(mockDocument);
  });

  it('handles keyboard navigation', () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    const card = screen.getByRole('button', { name: /view document: test document/i });
    
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockOnView).toHaveBeenCalledWith(mockDocument);

    fireEvent.keyDown(card, { key: ' ' });
    expect(mockOnView).toHaveBeenCalledTimes(2);
  });

  it('shows actions menu when more button is clicked', async () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Find and click the more actions button
    const moreButton = screen.getByLabelText('Document actions');
    fireEvent.click(moreButton);

    await waitFor(() => {
      expect(screen.getByText('View')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('calls onEdit when edit is clicked', async () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const moreButton = screen.getByLabelText('Document actions');
    fireEvent.click(moreButton);

    await waitFor(() => {
      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledWith(mockDocument);
    });
  });

  it('shows confirmation dialog before deleting', async () => {
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    const moreButton = screen.getByLabelText('Document actions');
    fireEvent.click(moreButton);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    confirmSpy.mockRestore();
  });

  it('does not delete when confirmation is cancelled', async () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);

    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    const moreButton = screen.getByLabelText('Document actions');
    fireEvent.click(moreButton);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
      expect(confirmSpy).toHaveBeenCalled();
      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    confirmSpy.mockRestore();
  });

  it('truncates long content', () => {
    const longContentDocument = {
      ...mockDocument,
      content: 'This is a very long document content that should be truncated when displayed in the card component to ensure proper layout and readability.',
    };

    render(
      <DocumentCard
        document={longContentDocument}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    const content = screen.getByText(/this is a very long document content/i);
    expect(content).toBeInTheDocument();
  });

  it('displays relative time correctly', () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={mockOnView}
        onDelete={mockOnDelete}
      />
    );

    // Should show relative time (e.g., "2 days ago")
    expect(screen.getByText(/ago/i)).toBeInTheDocument();
  });
});
