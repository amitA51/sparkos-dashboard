'use client';

import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className
}: BadgeProps) {
  const variants = {
    default: 'bg-[#1e293b] text-[#94a3b8]',
    success: 'bg-[#22c55e]/20 text-[#22c55e]',
    warning: 'bg-[#f59e0b]/20 text-[#f59e0b]',
    danger: 'bg-[#ef4444]/20 text-[#ef4444]',
    info: 'bg-[#3B82F6]/20 text-[#3B82F6]',
    purple: 'bg-[#8B5CF6]/20 text-[#8B5CF6]'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
