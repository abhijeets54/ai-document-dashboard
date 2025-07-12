'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { Button } from './button';
import { Tooltip } from './tooltip';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'action' | 'close' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
  showTooltip?: boolean;
  showRipple?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'action',
  size = 'icon',
  disabled = false,
  loading = false,
  className,
  tooltipPosition = 'bottom',
  showTooltip = true,
  showRipple = true,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Create ripple effect
    if (showRipple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
      }, 600);
    }

    // Button click animation
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 150);

    onClick();
  };

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      isLoading={loading}
      aria-label={label}
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        isClicked && 'scale-95',
        showRipple && 'button-enhanced',
        className
      )}
    >
      {/* Ripple effects */}
      {showRipple && ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      
      {/* Icon with hover animation */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.div>
    </Button>
  );

  if (showTooltip) {
    return (
      <Tooltip content={label} position={tooltipPosition}>
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
};

export { ActionButton };
