'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal, Button } from './';
import { AlertTriangle, Trash2, Info, AlertCircle } from 'lucide-react';

export type ConfirmationType = 'danger' | 'warning' | 'info';

export interface ConfirmationOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmationType;
  icon?: React.ReactNode;
}

interface ConfirmationContextType {
  confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

export const useConfirmation = () => {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions;
  resolve: (value: boolean) => void;
}

interface ConfirmationProviderProps {
  children: React.ReactNode;
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const [state, setState] = useState<ConfirmationState | null>(null);

  const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options: {
          confirmLabel: 'Confirm',
          cancelLabel: 'Cancel',
          type: 'info',
          ...options,
        },
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (state) {
      state.resolve(true);
      setState(null);
    }
  }, [state]);

  const handleCancel = useCallback(() => {
    if (state) {
      state.resolve(false);
      setState(null);
    }
  }, [state]);

  const handleClose = useCallback(() => {
    handleCancel();
  }, [handleCancel]);

  const getIcon = (type: ConfirmationType, customIcon?: React.ReactNode) => {
    if (customIcon) return customIcon;
    
    switch (type) {
      case 'danger':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getButtonVariant = (type: ConfirmationType) => {
    switch (type) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'primary';
      case 'info':
      default:
        return 'primary';
    }
  };

  return (
    <ConfirmationContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <Modal
          isOpen={state.isOpen}
          onClose={handleClose}
          size="sm"
          showCloseButton={false}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Icon */}
            <div className="flex-shrink-0">
              {getIcon(state.options.type!, state.options.icon)}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {state.options.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                {state.options.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 w-full pt-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                {state.options.cancelLabel}
              </Button>
              <Button
                variant={getButtonVariant(state.options.type!)}
                onClick={handleConfirm}
                className="flex-1"
              >
                {state.options.confirmLabel}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </ConfirmationContext.Provider>
  );
};

// Convenience hook for common confirmation dialogs
export const useCommonConfirmations = () => {
  const { confirm } = useConfirmation();

  const confirmDelete = useCallback((itemName?: string) => {
    return confirm({
      title: 'Delete Item',
      description: itemName 
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      type: 'danger',
      icon: <Trash2 className="h-6 w-6 text-red-500" />,
    });
  }, [confirm]);

  const confirmUnsavedChanges = useCallback(() => {
    return confirm({
      title: 'Unsaved Changes',
      description: 'You have unsaved changes. Are you sure you want to leave without saving?',
      confirmLabel: 'Leave',
      cancelLabel: 'Stay',
      type: 'warning',
    });
  }, [confirm]);

  const confirmAction = useCallback((title: string, description: string) => {
    return confirm({
      title,
      description,
      confirmLabel: 'Continue',
      cancelLabel: 'Cancel',
      type: 'info',
    });
  }, [confirm]);

  return {
    confirmDelete,
    confirmUnsavedChanges,
    confirmAction,
  };
};
