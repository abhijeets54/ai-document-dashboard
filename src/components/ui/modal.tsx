'use client';

import React, { useEffect } from 'react';
import { cn } from '@/utils';
import { X } from 'lucide-react';
import { ActionButton } from './action-button';
import { FocusTrap } from './focus-trap';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Modal */}
          <FocusTrap isActive={isOpen}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
                duration: 0.25
              }}
              className={cn(
                'relative w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl',
                sizeClasses[size]
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Close button - positioned absolutely for better UX */}
              {showCloseButton && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                  className="absolute top-4 right-4 z-10"
                >
                  <ActionButton
                    icon={<X className="h-4 w-4" />}
                    label="Close modal"
                    onClick={onClose}
                    variant="close"
                    className="shadow-lg"
                    tooltipPosition="left"
                  />
                </motion.div>
              )}

              {/* Header */}
              {title && (
                <div className="px-6 pt-6 pb-4">
                  <h2
                    id="modal-title"
                    className="text-xl font-semibold text-gray-900 dark:text-gray-100 pr-12"
                  >
                    {title}
                  </h2>
                </div>
              )}

              {/* Content */}
              <motion.div
                className={cn(
                  "px-6 pb-6",
                  title ? "pt-0" : "pt-6"
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </motion.div>
          </FocusTrap>
        </div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
