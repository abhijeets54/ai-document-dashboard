import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentCard } from '../document-card';
import { Document } from '@/types';
import { ConfirmationProvider } from '@/components/ui';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => <>{children}</>,
}));

// Test wrapper component that provides necessary context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ConfirmationProvider>
      {children}
    </ConfirmationProvider>
  );
};

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
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
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
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
    );

    fireEvent.click(screen.getByRole('button', { name: /view document: test document/i }));
    expect(mockOnView).toHaveBeenCalledWith(mockDocument);
  });

  it('handles keyboard navigation', () => {
    render(
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
    );

    const card = screen.getByRole('button', { name: /view document: test document/i });

    fireEvent.keyDown(card, { key: 'Enter' });
    expect(mockOnView).toHaveBeenCalledWith(mockDocument);

    fireEvent.keyDown(card, { key: ' ' });
    expect(mockOnView).toHaveBeenCalledTimes(2);
  });

  it('shows actions menu when more button is clicked', async () => {
    render(
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
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
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
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
    render(
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
    );

    const moreButton = screen.getByLabelText('Document actions');
    fireEvent.click(moreButton);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
    });

    // Check that confirmation dialog appears
    await waitFor(() => {
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    });

    // Click confirm button in the dialog
    const confirmButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('does not delete when confirmation is cancelled', async () => {
    render(
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
    );

    const moreButton = screen.getByLabelText('Document actions');
    fireEvent.click(moreButton);

    await waitFor(() => {
      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);
    });

    // Check that confirmation dialog appears
    await waitFor(() => {
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
    });

    // Click cancel button in the dialog
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  it('truncates long content', () => {
    const longContentDocument = {
      ...mockDocument,
      content: 'This is a very long document content that should be truncated when displayed in the card component to ensure proper layout and readability.',
    };

    render(
      <TestWrapper>
        <DocumentCard
          document={longContentDocument}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
    );

    const content = screen.getByText(/this is a very long document content/i);
    expect(content).toBeInTheDocument();
  });

  it('displays relative time correctly', () => {
    render(
      <TestWrapper>
        <DocumentCard
          document={mockDocument}
          onView={mockOnView}
          onDelete={mockOnDelete}
        />
      </TestWrapper>
    );

    // Should show relative time (e.g., "2 days ago")
    expect(screen.getByText(/ago/i)).toBeInTheDocument();
  });
});
