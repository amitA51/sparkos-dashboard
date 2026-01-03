'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Circle,
  Calendar,
  Zap,
  ChevronLeft,
  Flame,
  Target,
  ArrowLeft,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { Badge } from '@/components/ui';
import { formatRelativeDate, isOverdue } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import type { TaskItem } from '@/lib/types';
import Link from 'next/link';

export function ActiveZone() {
  const { items, completeItem } = useItemsStore();

  // Get active tasks, sorted by priority and date
  const tasks = items.filter(item => item.type === 'task') as TaskItem[];

  const overdueTasks = tasks.filter(t => !t.isCompleted && t.dueDate && isOverdue(t.dueDate));
  const todaysTasks = tasks.filter(t => {
    if (t.isCompleted || !t.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.dueDate.startsWith(today);
  });
  const upcomingTasks = tasks.filter(t => {
    if (t.isCompleted || !t.dueDate) return false;
    const today = new Date().toISOString().split('T')[0];
    return t.dueDate > today;
  }).slice(0, 5);

  const priorityOrder = { high: 0, medium: 1, low: 2 };

  const sortTasks = (taskList: TaskItem[]) => {
    return [...taskList].sort((a, b) => {
      const aPriority = priorityOrder[a.priority || 'low'];
      const bPriority = priorityOrder[b.priority || 'low'];
      if (aPriority !== bPriority) return aPriority - bPriority;
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      return 0;
    });
  };

  const handleComplete = async (id: string) => {
    await completeItem(id);
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-red-500/20 to-orange-500/10',
          border: 'border-red-500/40',
          text: 'text-red-400',
          dot: 'bg-red-500',
          label: 'דחוף'
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          dot: 'bg-amber-500',
          label: 'בינוני'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-500/20 to-slate-500/10',
          border: 'border-slate-500/30',
          text: 'text-slate-400',
          dot: 'bg-slate-500',
          label: 'נמוך'
        };
    }
  };

  const TaskCard = ({ task, isOverdueItem = false, index = 0 }: { task: TaskItem; isOverdueItem?: boolean; index?: number }) => {
    const priorityConfig = getPriorityConfig(task.priority || 'low');

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20, height: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: -6, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer group overflow-hidden',
          isOverdueItem
            ? 'bg-gradient-to-r from-red-500/15 to-red-500/5 border border-red-500/30'
            : 'bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/[0.08] hover:border-white/[0.15]'
        )}
      >
        {/* Priority indicator line */}
        <div className={cn(
          'absolute right-0 top-0 bottom-0 w-1 rounded-r-xl',
          isOverdueItem ? 'bg-red-500' : priorityConfig.dot
        )} />

        {/* Checkbox */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={(e) => {
            e.stopPropagation();
            handleComplete(task.id);
          }}
          className={cn(
            'relative flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all',
            isOverdueItem
              ? 'border-red-500/60 hover:border-red-400 hover:bg-red-500/20'
              : 'border-[#3B82F6]/50 hover:border-[#3B82F6] hover:bg-[#3B82F6]/20'
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <CheckCircle2 className={cn(
              'w-4 h-4',
              isOverdueItem ? 'text-red-400' : 'text-[#3B82F6]'
            )} />
          </motion.div>
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium truncate text-[15px]',
            isOverdueItem ? 'text-red-300' : 'text-[#f8fafc]'
          )}>
            {task.title}
          </p>

          <div className="flex items-center gap-3 mt-1">
            {task.dueTime && (
              <span className="text-xs text-[#64748b] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.dueTime}
              </span>
            )}
            {task.dueDate && !isOverdueItem && (
              <span className="text-xs text-[#64748b]">
                {formatRelativeDate(task.dueDate)}
              </span>
            )}
          </div>
        </div>

        {/* Priority badge */}
        {task.priority && (
          <div className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-medium',
            priorityConfig.bg,
            priorityConfig.text
          )}>
            {priorityConfig.label}
          </div>
        )}

        {/* Hover arrow */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowLeft className="w-4 h-4 text-[#64748b]" />
        </motion.div>

        {/* Shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>
      </motion.div>
    );
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    count,
    color
  }: {
    icon: React.ElementType;
    title: string;
    count: number;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 mb-4"
    >
      <div className={cn('p-2 rounded-lg', color)}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h4 className="text-sm font-bold text-[#f8fafc]">{title}</h4>
      <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-xs text-[#94a3b8] font-medium">
        {count}
      </span>
    </motion.div>
  );

  const hasAnyTasks = overdueTasks.length > 0 || todaysTasks.length > 0 || upcomingTasks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-[#f8fafc]">אזור פעיל</h3>
            <p className="text-xs text-[#64748b]">המשימות הדחופות שלך</p>
          </div>
        </div>

        <Link
          href="/tasks"
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] transition-all text-sm text-[#94a3b8] hover:text-[#f8fafc]"
        >
          הצג הכל
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {!hasAnyTasks ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 flex items-center justify-center mb-4"
          >
            <PartyPopper className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h4 className="text-lg font-bold text-[#f8fafc] mb-2">אין משימות פעילות!</h4>
          <p className="text-sm text-[#64748b] mb-4">נראה שסיימת הכל, כל הכבוד!</p>
          <Link
            href="/tasks"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Target className="w-4 h-4" />
            הוסף משימה חדשה
          </Link>
        </motion.div>
      ) : (
        <div className="relative space-y-6 max-h-[500px] overflow-y-auto hide-scrollbar">
          {/* Overdue Section */}
          <AnimatePresence>
            {overdueTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <SectionHeader
                  icon={AlertTriangle}
                  title="באיחור"
                  count={overdueTasks.length}
                  color="bg-gradient-to-br from-red-500 to-rose-600"
                />
                <div className="space-y-2">
                  {sortTasks(overdueTasks).map((task, index) => (
                    <TaskCard key={task.id} task={task} isOverdueItem index={index} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Today's Tasks */}
          <div>
            <SectionHeader
              icon={Clock}
              title="היום"
              count={todaysTasks.length}
              color="bg-gradient-to-br from-blue-500 to-cyan-500"
            />
            {todaysTasks.length > 0 ? (
              <div className="space-y-2">
                {sortTasks(todaysTasks).map((task, index) => (
                  <TaskCard key={task.id} task={task} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-6 text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl text-emerald-400 text-sm">
                  <Sparkles className="w-4 h-4" />
                  אין משימות להיום
                </div>
              </motion.div>
            )}
          </div>

          {/* Upcoming */}
          <AnimatePresence>
            {upcomingTasks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <SectionHeader
                  icon={Calendar}
                  title="בקרוב"
                  count={upcomingTasks.length}
                  color="bg-gradient-to-br from-purple-500 to-violet-600"
                />
                <div className="space-y-2">
                  {sortTasks(upcomingTasks).map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Decorative corner */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}
