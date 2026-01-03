'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'glow' | 'gradient' | 'premium' | 'neon';
  hover?: boolean;
  glow?: 'blue' | 'purple' | 'green' | 'amber' | 'none';
  children: React.ReactNode;
}

export function Card({
  variant = 'default',
  hover = true,
  glow = 'none',
  className,
  children,
  ...props
}: CardProps) {
  const variants = {
    default: 'bg-[#0c0c12]/80 backdrop-blur-xl border border-white/[0.06]',
    glass: 'glass-card',
    glow: 'bg-[#0c0c12]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    gradient: 'bg-gradient-to-br from-[#0c0c12] via-[#0f0f18] to-[#12121a] border border-white/[0.06]',
    premium: 'bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-2xl border border-white/[0.08] shadow-xl',
    neon: 'bg-[#0c0c12]/90 backdrop-blur-xl border-2 border-[#3B82F6]/30 shadow-[0_0_20px_rgba(59,130,246,0.2),inset_0_0_20px_rgba(59,130,246,0.05)]'
  };

  const glowStyles = {
    none: '',
    blue: 'shadow-[0_0_40px_rgba(59,130,246,0.15)]',
    purple: 'shadow-[0_0_40px_rgba(139,92,246,0.15)]',
    green: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    amber: 'shadow-[0_0_40px_rgba(245,158,11,0.15)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? {
        y: -3,
        scale: 1.01,
        transition: { duration: 0.2, ease: 'easeOut' }
      } : undefined}
      className={cn(
        'rounded-2xl p-5 relative overflow-hidden',
        variants[variant],
        glowStyles[glow],
        hover && 'cursor-pointer transition-all duration-300',
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Hover shine effect */}
      {hover && (
        <motion.div
          className="absolute inset-0 opacity-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full"
          whileHover={{
            opacity: 1,
            x: '200%',
            transition: { duration: 0.6, ease: 'easeInOut' }
          }}
        />
      )}
    </motion.div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  gradient = false
}: {
  className?: string;
  children: React.ReactNode;
  gradient?: boolean;
}) {
  return (
    <h3 className={cn(
      'text-lg font-semibold',
      gradient ? 'gradient-text' : 'text-[#f8fafc]',
      className
    )}>
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

export function CardIcon({
  className,
  children,
  color = 'blue'
}: {
  className?: string;
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'cyan' | 'red' | 'pink';
}) {
  const colors = {
    blue: 'bg-[#3B82F6]/10 text-[#3B82F6]',
    purple: 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
    green: 'bg-[#10b981]/10 text-[#10b981]',
    amber: 'bg-[#f59e0b]/10 text-[#f59e0b]',
    cyan: 'bg-[#06b6d4]/10 text-[#06b6d4]',
    red: 'bg-[#ef4444]/10 text-[#ef4444]',
    pink: 'bg-[#ec4899]/10 text-[#ec4899]',
  };

  return (
    <div className={cn(
      'p-3 rounded-xl flex items-center justify-center',
      colors[color],
      className
    )}>
      {children}
    </div>
  );
}

// Bento Grid Card - for dashboard layout
export function BentoCard({
  size = 'md',
  tall = false,
  className,
  children,
  ...props
}: CardProps & {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  tall?: boolean;
}) {
  const sizes = {
    sm: 'bento-sm',
    md: 'bento-md',
    lg: 'bento-lg',
    xl: 'bento-xl',
    full: 'bento-full',
  };

  return (
    <Card
      variant="premium"
      className={cn(
        'bento-item',
        sizes[size],
        tall && 'bento-tall',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}
