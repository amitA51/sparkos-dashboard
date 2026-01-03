'use client';

import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import { Sparkles, Trophy, Flame } from 'lucide-react';
import { Progress } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';

export function DailyScore() {
  const { items } = useItemsStore();
  const [hasConfetti, setHasConfetti] = useState(false);

  // Calculate daily score
  const todayStr = new Date().toISOString().split('T')[0];

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

  const totalScore = Math.round(taskScore + habitScore);

  // Trigger confetti at 100%
  useEffect(() => {
    if (totalScore === 100 && !hasConfetti) {
      setHasConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [totalScore, hasConfetti]);

  const getScoreColor = () => {
    if (totalScore >= 80) return 'text-[#22c55e]';
    if (totalScore >= 50) return 'text-[#f59e0b]';
    return 'text-[#94a3b8]';
  };

  const getScoreEmoji = () => {
    if (totalScore >= 100) return <Trophy className="w-6 h-6 text-[#f59e0b]" />;
    if (totalScore >= 80) return <Flame className="w-6 h-6 text-[#ef4444] fire-animation" />;
    if (totalScore >= 50) return <Sparkles className="w-6 h-6 text-[#8B5CF6]" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-6 card-hover"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#f8fafc] flex items-center gap-2">
          ציון יומי
          {getScoreEmoji()}
        </h3>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <Progress
            value={totalScore}
            max={100}
            variant="circle"
            size="lg"
            showLabel={false}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn('text-3xl font-bold', getScoreColor())}>
              {totalScore}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#94a3b8]">משימות</span>
          <span className="text-[#f8fafc]">{completedTasks.length}/{todaysTasks.length}</span>
        </div>
        <Progress value={completedTasks.length} max={Math.max(todaysTasks.length, 1)} size="sm" />

        <div className="flex items-center justify-between text-sm mt-4">
          <span className="text-[#94a3b8]">הרגלים</span>
          <span className="text-[#f8fafc]">{completedHabits.length}/{todaysHabits.length}</span>
        </div>
        <Progress value={completedHabits.length} max={Math.max(todaysHabits.length, 1)} size="sm" />
      </div>
    </motion.div>
  );
}
