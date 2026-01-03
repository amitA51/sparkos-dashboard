'use client';

import { motion } from 'framer-motion';
import { Flame, Check, Circle } from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';
import type { HabitItem } from '@/lib/types';

export function HabitsPanel() {
  const { items, updateItem } = useItemsStore();
  const todayStr = new Date().toISOString().split('T')[0];

  const habits = items.filter(item => item.type === 'habit') as HabitItem[];

  const handleToggleHabit = async (habit: HabitItem) => {
    const isCompleted = habit.lastCompletedDate === todayStr;

    await updateItem(habit.id, {
      lastCompletedDate: isCompleted ? undefined : todayStr,
      streak: isCompleted ? Math.max((habit.streak || 1) - 1, 0) : (habit.streak || 0) + 1
    });
  };

  if (habits.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-[#f8fafc] mb-4">הרגלים יומיים</h3>
        <p className="text-[#64748b] text-sm text-center py-4">
          עדיין אין הרגלים
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-[#f8fafc] mb-4 flex items-center gap-2">
        <Flame className="w-5 h-5 text-[#ef4444]" />
        הרגלים יומיים
      </h3>

      <div className="space-y-3">
        {habits.map((habit) => {
          const isCompleted = habit.lastCompletedDate === todayStr;
          const streak = habit.streak || 0;

          return (
            <motion.div
              key={habit.id}
              whileHover={{ x: -4 }}
              onClick={() => handleToggleHabit(habit)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                isCompleted
                  ? 'bg-[#22c55e]/10 border border-[#22c55e]/30'
                  : 'bg-[#12121a] border border-[#1e293b] hover:bg-[#1a1a25]'
              )}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                  isCompleted
                    ? 'bg-[#22c55e] border-[#22c55e]'
                    : 'border-[#3B82F6]'
                )}
              >
                {isCompleted && <Check className="w-4 h-4 text-white" />}
              </motion.div>

              <span className={cn(
                'flex-1 font-medium',
                isCompleted ? 'text-[#22c55e]' : 'text-[#f8fafc]'
              )}>
                {habit.title}
              </span>

              {streak > 0 && (
                <div className="flex items-center gap-1">
                  <Flame className={cn(
                    'w-4 h-4',
                    streak >= 7 ? 'text-[#ef4444] fire-animation' : 'text-[#f59e0b]'
                  )} />
                  <span className="text-sm font-semibold text-[#f8fafc]">{streak}</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
