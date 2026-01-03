'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Check, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';
import type { HabitItem } from '@/lib/types';

export default function HabitsPage() {
  const { items, updateItem, deleteItem, addItem } = useItemsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const habits = items.filter(item => item.type === 'habit') as HabitItem[];

  const handleToggleHabit = async (habit: HabitItem) => {
    const isCompleted = habit.lastCompletedDate === todayStr;

    await updateItem(habit.id, {
      lastCompletedDate: isCompleted ? undefined : todayStr,
      streak: isCompleted ? Math.max((habit.streak || 1) - 1, 0) : (habit.streak || 0) + 1
    });
  };

  const handleAddHabit = async () => {
    if (!newHabitTitle.trim()) return;

    await addItem({
      type: 'habit',
      title: newHabitTitle,
      streak: 0,
      isCompleted: false,
    } as any);

    setNewHabitTitle('');
    setShowAddForm(false);
  };

  const completedToday = habits.filter(h => h.lastCompletedDate === todayStr);
  const pendingToday = habits.filter(h => h.lastCompletedDate !== todayStr);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc] flex items-center gap-3">
            <Flame className="w-8 h-8 text-[#ef4444]" />
            הרגלים
          </h1>
          <p className="text-[#94a3b8] mt-1">
            {completedToday.length}/{habits.length} הושלמו היום
          </p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          הרגל חדש
        </Button>
      </div>

      {/* Add Habit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                  placeholder="שם ההרגל..."
                  autoFocus
                  className="flex-1 bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-lg"
                />
                <Button onClick={handleAddHabit} size="sm">
                  הוסף
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">
                  ביטול
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      {habits.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#94a3b8]">התקדמות יומית</span>
            <span className="text-sm font-semibold text-[#f8fafc]">
              {Math.round((completedToday.length / habits.length) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedToday.length / habits.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-[#22c55e] to-[#3B82F6] rounded-full"
            />
          </div>
        </div>
      )}

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {habits.map((habit) => {
            const isCompleted = habit.lastCompletedDate === todayStr;
            const streak = habit.streak || 0;

            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className={cn(
                  'p-6 rounded-2xl border transition-all cursor-pointer',
                  isCompleted
                    ? 'bg-[#22c55e]/10 border-[#22c55e]/30'
                    : 'bg-[#0d0d14] border-[#1e293b] hover:border-[#3B82F6]/30'
                )}
                onClick={() => handleToggleHabit(habit)}
              >
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                      isCompleted
                        ? 'bg-[#22c55e] border-[#22c55e]'
                        : 'border-[#3B82F6]'
                    )}
                  >
                    {isCompleted && <Check className="w-5 h-5 text-white" />}
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteItem(habit.id);
                    }}
                    className="p-2 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <h3 className={cn(
                  'text-lg font-semibold mb-2',
                  isCompleted ? 'text-[#22c55e]' : 'text-[#f8fafc]'
                )}>
                  {habit.title}
                </h3>

                {streak > 0 && (
                  <div className="flex items-center gap-2">
                    <Flame className={cn(
                      'w-5 h-5',
                      streak >= 7 ? 'text-[#ef4444] fire-animation' : 'text-[#f59e0b]'
                    )} />
                    <span className="text-lg font-bold text-[#f8fafc]">{streak}</span>
                    <span className="text-sm text-[#94a3b8]">ימים ברצף</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {habits.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a25] flex items-center justify-center">
            <Flame className="w-10 h-10 text-[#64748b]" />
          </div>
          <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">אין הרגלים</h3>
          <p className="text-[#94a3b8] mb-4">הוסף הרגל יומי כדי לעקוב אחרי ההתקדמות שלך</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-5 h-5" />
            הרגל חדש
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
