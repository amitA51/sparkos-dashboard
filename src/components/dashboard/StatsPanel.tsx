'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import {
  CheckSquare,
  Repeat,
  FileText,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Calendar,
  Target,
  Brain,
  Sparkles
} from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  gradient: string;
  delay: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  sparklineData?: number[];
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 60;
    const y = 20 - ((value - min) / range) * 16;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="60" height="24" className="opacity-60">
      <defs>
        <linearGradient id={`sparkline-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({ label, value, icon: Icon, color, gradient, delay, trend, trendValue, sparklineData }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group"
    >
      {/* Glow effect on hover */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10',
        gradient
      )} />

      <div className="relative bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 overflow-hidden">
        {/* Background gradient accent */}
        <div className={cn(
          'absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl pointer-events-none',
          gradient
        )} />

        {/* Header with icon */}
        <div className="relative flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={cn('p-3 rounded-xl', gradient)}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>

          {/* Trend indicator */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 }}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
                trend === 'up' && 'bg-emerald-500/20 text-emerald-400',
                trend === 'down' && 'bg-red-500/20 text-red-400',
                trend === 'neutral' && 'bg-slate-500/20 text-slate-400'
              )}
            >
              {trend === 'up' && <TrendingUp className="w-3 h-3" />}
              {trend === 'down' && <TrendingDown className="w-3 h-3" />}
              {trend === 'neutral' && <Minus className="w-3 h-3" />}
              {trendValue !== undefined && <span>{trendValue > 0 ? '+' : ''}{trendValue}%</span>}
            </motion.div>
          )}
        </div>

        {/* Value */}
        <div className="relative flex items-end justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
              className="text-3xl font-black text-[#f8fafc] mb-1"
            >
              <AnimatedCounter value={value} />
            </motion.p>
            <p className="text-sm text-[#64748b] font-medium">{label}</p>
          </div>

          {/* Mini sparkline */}
          {sparklineData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.4 }}
            >
              <MiniSparkline data={sparklineData} color={color} />
            </motion.div>
          )}
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
}

export function StatsPanel() {
  const { items } = useItemsStore();

  const stats = useMemo(() => {
    const tasks = items.filter(i => i.type === 'task');
    const activeTasks = tasks.filter(i => !('isCompleted' in i && i.isCompleted)).length;
    const habits = items.filter(i => i.type === 'habit').length;
    const notes = items.filter(i => i.type === 'note').length;
    const ideas = items.filter(i => i.type === 'idea').length;
    const learnings = items.filter(i => i.type === 'learning').length;

    // Generate fake sparkline data for visual effect
    const generateSparkline = (base: number) => {
      return Array.from({ length: 7 }, () => Math.max(0, base + Math.floor(Math.random() * 5 - 2)));
    };

    return [
      {
        label: 'משימות פעילות',
        value: activeTasks,
        icon: Target,
        color: '#3B82F6',
        gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
        trend: 'up' as const,
        trendValue: 12,
        sparklineData: generateSparkline(activeTasks)
      },
      {
        label: 'הרגלים יומיים',
        value: habits,
        icon: Repeat,
        color: '#8B5CF6',
        gradient: 'bg-gradient-to-br from-purple-500 to-violet-600',
        trend: 'up' as const,
        trendValue: 8,
        sparklineData: generateSparkline(habits)
      },
      {
        label: 'פתקים שמורים',
        value: notes,
        icon: FileText,
        color: '#22c55e',
        gradient: 'bg-gradient-to-br from-emerald-500 to-green-600',
        trend: 'neutral' as const,
        sparklineData: generateSparkline(notes)
      },
      {
        label: 'רעיונות',
        value: ideas,
        icon: Lightbulb,
        color: '#f59e0b',
        gradient: 'bg-gradient-to-br from-amber-500 to-orange-500',
        trend: 'up' as const,
        trendValue: 25,
        sparklineData: generateSparkline(ideas)
      },
      {
        label: 'נלמד',
        value: learnings,
        icon: Brain,
        color: '#ec4899',
        gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
        trend: 'up' as const,
        trendValue: 15,
        sparklineData: generateSparkline(learnings)
      },
      {
        label: 'סה"כ פריטים',
        value: items.length,
        icon: Sparkles,
        color: '#06b6d4',
        gradient: 'bg-gradient-to-br from-cyan-500 to-teal-500',
        trend: 'up' as const,
        trendValue: 5,
        sparklineData: generateSparkline(items.length)
      },
    ];
  }, [items]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-5"
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20">
          <Zap className="w-5 h-5 text-[#3B82F6]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#f8fafc]">סטטיסטיקות מהירות</h3>
          <p className="text-xs text-[#64748b]">סקירה כללית של הפעילות שלך</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            {...stat}
            delay={index * 0.08}
          />
        ))}
      </div>
    </motion.div>
  );
}
