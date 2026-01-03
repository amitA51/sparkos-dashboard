'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Check, Plus, Sparkles, Trophy, Zap } from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';
import type { HabitItem } from '@/lib/types';
import Link from 'next/link';

export function HabitsPanel() {
  const { items, updateItem } = useItemsStore();
  const todayStr = new Date().toISOString().split('T')[0];

  const habits = items.filter(item => item.type === 'habit') as HabitItem[];
  const completedCount = habits.filter(h => h.lastCompletedDate === todayStr).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleToggleHabit = async (habit: HabitItem) => {
    const isCompleted = habit.lastCompletedDate === todayStr;

    await updateItem(habit.id, {
      lastCompletedDate: isCompleted ? undefined : todayStr,
      streak: isCompleted ? Math.max((habit.streak || 1) - 1, 0) : (habit.streak || 0) + 1
    });
  };

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Legend!' };
    if (streak >= 14) return { icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/20', label: 'On Fire!' };
    if (streak >= 7) return { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Hot!' };
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/10">
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#f8fafc]">הרגלים יומיים</h3>
            <p className="text-xs text-[#64748b]">{completedCount}/{totalCount} הושלמו היום</p>
          </div>
        </div>

        <Link
          href="/habits"
          className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all"
        >
          <Plus className="w-4 h-4 text-[#94a3b8]" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="relative mb-5">
        <div className="h-2 bg-[#0d0d14] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Habits list */}
      {habits.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-orange-400/50" />
          </div>
          <p className="text-[#64748b] text-sm mb-3">עדיין אין הרגלים</p>
          <Link
            href="/habits"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            הוסף הרגל
          </Link>
        </div>
      ) : (
        <div className="relative space-y-2.5 max-h-[300px] overflow-y-auto hide-scrollbar">
          <AnimatePresence>
            {habits.slice(0, 6).map((habit, index) => {
              const isCompleted = habit.lastCompletedDate === todayStr;
              const streak = habit.streak || 0;
              const streakBadge = getStreakBadge(streak);

              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleHabit(habit)}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all duration-200',
                    isCompleted
                      ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5 border border-emerald-500/30'
                      : 'bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04]'
                  )}
                >
                  {/* Checkbox */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.85 }}
                    className={cn(
                      'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all',
                      isCompleted
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30'
                        : 'border-2 border-[#3B82F6]/50 hover:border-[#3B82F6]'
                    )}
                  >
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Check className="w-4 h-4 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Title */}
                  <span className={cn(
                    'flex-1 font-medium text-sm truncate',
                    isCompleted ? 'text-emerald-400' : 'text-[#f8fafc]'
                  )}>
                    {habit.title}
                  </span>

                  {/* Streak */}
                  {streak > 0 && (
                    <div className={cn(
                      'flex items-center gap-1.5 px-2.5 py-1 rounded-full',
                      streakBadge?.bg || 'bg-[#0d0d14]'
                    )}>
                      <Flame className={cn(
                        'w-3.5 h-3.5',
                        streak >= 7 ? 'text-orange-400 animate-fire' : 'text-orange-400/70'
                      )} />
                      <span className={cn(
                        'text-xs font-bold',
                        streak >= 7 ? 'streak-fire' : 'text-[#f8fafc]'
                      )}>
                        {streak}
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {habits.length > 6 && (
            <Link
              href="/habits"
              className="block text-center py-2 text-sm text-[#3B82F6] hover:text-[#60a5fa] transition-colors"
            >
              ועוד {habits.length - 6} הרגלים...
            </Link>
          )}
        </div>
      )}

      {/* Achievement indicator */}
      {progress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gradient-to-r from-amber-500/20 to-orange-500/10 rounded-xl border border-amber-500/30 flex items-center gap-3"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium text-amber-300">כל ההרגלים הושלמו!</span>
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}
