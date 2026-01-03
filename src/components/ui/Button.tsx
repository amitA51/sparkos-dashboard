'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'premium' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  glow?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  glow = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-[#3B82F6] to-[#6366f1] hover:from-[#2563eb] hover:to-[#4f46e5] text-white shadow-lg shadow-blue-500/25',
    secondary: 'bg-[#12121a]/80 backdrop-blur-sm hover:bg-[#1a1a25] text-[#f8fafc] border border-white/[0.08] hover:border-white/[0.12]',
    ghost: 'bg-transparent hover:bg-white/[0.05] text-[#94a3b8] hover:text-[#f8fafc]',
    danger: 'bg-gradient-to-r from-[#ef4444] to-[#dc2626] hover:from-[#dc2626] hover:to-[#b91c1c] text-white shadow-lg shadow-red-500/25',
    success: 'bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white shadow-lg shadow-emerald-500/25',
    premium: 'bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#ec4899] hover:opacity-90 text-white shadow-lg shadow-purple-500/30',
    outline: 'bg-transparent border-2 border-[#3B82F6]/50 hover:border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6]/10'
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-7 py-3.5 text-lg gap-2.5',
    icon: 'p-2.5'
  };

  const glowStyles = glow ? {
    primary: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    secondary: 'shadow-[0_0_20px_rgba(255,255,255,0.05)]',
    ghost: '',
    danger: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
    success: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    premium: 'shadow-[0_0_40px_rgba(139,92,246,0.5)]',
    outline: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]'
  }[variant] : '';

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#000000]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        'overflow-hidden',
        variants[variant],
        sizes[size],
        glowStyles,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-xl">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
      </span>

      {/* Content */}
      <span className="relative flex items-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </span>
    </motion.button>
  );
}

// Icon Button variant
export function IconButton({
  variant = 'ghost',
  size = 'icon',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('rounded-xl', className)}
      {...props}
    >
      {children}
    </Button>
  );
}
