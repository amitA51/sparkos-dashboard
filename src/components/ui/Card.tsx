'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'glow' | 'gradient';
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  hover = true,
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-[#0d0d14] border border-[#1e293b]',
    glass: 'glass',
    glow: 'bg-[#0d0d14] border border-[#1e293b] glow-blue',
    gradient: 'bg-gradient-to-br from-[#0d0d14] to-[#12121a] border border-[#1e293b]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={cn(
        'rounded-xl p-4',
        variants[variant],
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('text-lg font-semibold text-[#f8fafc]', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('text-[#94a3b8]', className)}>
      {children}
    </div>
  );
}
