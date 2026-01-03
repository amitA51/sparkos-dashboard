'use client';

import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useState, useMemo } from 'react';
import { Sparkles, Trophy, Flame, TrendingUp, Target, Zap } from 'lucide-react';
import { Progress } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';

export function DailyScore() {
  const { items } = useItemsStore();
  const [hasConfetti, setHasConfetti] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);

  // Calculate daily score
  const todayStr = new Date().toISOString().split('T')[0];

  const { todaysTasks, completedTasks, todaysHabits, completedHabits, totalScore } = useMemo(() => {
    const todaysTasks = items.filter(item => {
      if (item.type !== 'task') return false;
      const task = item as typeof item & { dueDate?: string };
      return task.dueDate?.startsWith(todayStr);
    });

    const completedTasks = todaysTasks.filter(item => {
      const task = item as typeof item & { isCompleted?: boolean };
      return task.isCompleted;
    });

    const todaysHabits = items.filter(item => item.type === 'habit');
    const completedHabits = todaysHabits.filter(item => {
      const habit = item as typeof item & { lastCompletedDate?: string };
      return habit.lastCompletedDate === todayStr;
    });

    const taskScore = todaysTasks.length > 0
      ? (completedTasks.length / todaysTasks.length) * 50
      : 25;

    const habitScore = todaysHabits.length > 0
      ? (completedHabits.length / todaysHabits.length) * 50
      : 25;

    return {
      todaysTasks,
      completedTasks,
      todaysHabits,
      completedHabits,
      totalScore: Math.round(taskScore + habitScore)
    };
  }, [items, todayStr]);

  // Animate score counting
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    const increment = totalScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalScore) {
        setDisplayScore(totalScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [totalScore]);

  // Trigger confetti at 100%
  useEffect(() => {
    if (totalScore === 100 && !hasConfetti) {
      setHasConfetti(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#3B82F6', '#8B5CF6', '#22c55e', '#f59e0b', '#ec4899']
      });
    }
  }, [totalScore, hasConfetti]);

  const getScoreGradient = () => {
    if (totalScore >= 80) return 'from-emerald-500 via-emerald-400 to-green-300';
    if (totalScore >= 50) return 'from-amber-500 via-orange-400 to-yellow-300';
    return 'from-blue-500 via-blue-400 to-cyan-300';
  };

  const getScoreMessage = () => {
    if (totalScore >= 100) return 'מושלם! יום מדהים! ';
    if (totalScore >= 80) return 'עבודה מעולה!';
    if (totalScore >= 50) return 'ממשיכים קדימה!';
    return 'בוא נתחיל!';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background glow effect */}
      <div className={cn(
        'absolute inset-0 opacity-20 blur-3xl',
        totalScore >= 80 ? 'bg-emerald-500' : totalScore >= 50 ? 'bg-amber-500' : 'bg-blue-500'
      )} />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20">
            <Target className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <h3 className="text-lg font-bold text-[#f8fafc]">ציון יומי</h3>
        </div>
        <AnimatePresence>
          {totalScore >= 80 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full"
            >
              <Flame className="w-4 h-4 text-orange-400 animate-fire" />
              <span className="text-xs font-bold text-orange-400">HOT!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Circular Progress */}
      <div className="relative flex items-center justify-center mb-6">
        <svg width="140" height="140" className="transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <motion.circle
            cx="70"
            cy="70"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayScore}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn('text-4xl font-black bg-gradient-to-br bg-clip-text text-transparent', getScoreGradient())}
          >
            {displayScore}
          </motion.span>
          <span className="text-xs text-[#64748b] font-medium">מתוך 100</span>
        </div>
      </div>

      {/* Message */}
      <motion.p
        key={getScoreMessage()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-sm font-medium text-[#94a3b8] mb-6"
      >
        {getScoreMessage()}
      </motion.p>

      {/* Stats breakdown */}
      <div className="relative space-y-4">
        {/* Tasks */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#3B82F6]" />
              <span className="text-[#94a3b8]">משימות</span>
            </div>
            <span className="text-[#f8fafc] font-semibold">
              {completedTasks.length}/{todaysTasks.length}
            </span>
          </div>
          <div className="h-2 bg-[#0d0d14] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366f1] rounded-full"
            />
          </div>
        </div>

        {/* Habits */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="text-[#94a3b8]">הרגלים</span>
            </div>
            <span className="text-[#f8fafc] font-semibold">
              {completedHabits.length}/{todaysHabits.length}
            </span>
          </div>
          <div className="h-2 bg-[#0d0d14] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todaysHabits.length > 0 ? (completedHabits.length / todaysHabits.length) * 100 : 0}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              className="h-full bg-gradient-to-r from-[#10b981] to-[#34d399] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-[#3B82F6]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
}
