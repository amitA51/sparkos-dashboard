'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface ProgressProps {
  value: number;
  max?: number;
  variant?: 'linear' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  variant = 'linear',
  size = 'md',
  showLabel = false,
  className
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (variant === 'circle') {
    const sizes = { sm: 48, md: 64, lg: 96 };
    const strokeWidths = { sm: 4, md: 6, lg: 8 };

    const dimension = sizes[size];
    const strokeWidth = strokeWidths[size];
    const radius = (dimension - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className={cn('relative inline-flex items-center justify-center', className)}>
        <svg width={dimension} height={dimension} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeDasharray={circumference}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
          </defs>
        </svg>
        {showLabel && (
          <span className="absolute text-sm font-semibold text-[#f8fafc]">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }

  // Linear progress
  const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

  return (
    <div className={cn('w-full', className)}>
      <div className={cn('w-full bg-[#1e293b] rounded-full overflow-hidden', heights[size])}>
        <motion.div
          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[#94a3b8] mt-1 block text-left">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
