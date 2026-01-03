'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Clock, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { Badge } from '@/components/ui';
import { formatRelativeDate, isOverdue } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import type { TaskItem } from '@/lib/types';

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
  }).slice(0, 3);

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

  const TaskItem = ({ task, isOverdueItem = false }: { task: TaskItem; isOverdueItem?: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      whileHover={{ x: -4 }}
      className={cn(
        'flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer',
        isOverdueItem
          ? 'bg-[#ef4444]/10 border border-[#ef4444]/30'
          : 'bg-[#12121a] hover:bg-[#1a1a25] border border-[#1e293b]'
      )}
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleComplete(task.id)}
        className={cn(
          'flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors',
          isOverdueItem ? 'border-[#ef4444]' : 'border-[#3B82F6]',
          'hover:bg-[#3B82F6]/20'
        )}
      >
        <Circle className="w-full h-full opacity-0 hover:opacity-100 text-[#3B82F6]" />
      </motion.button>

      <div className="flex-1 min-w-0">
        <p className={cn(
          'font-medium truncate',
          isOverdueItem ? 'text-[#ef4444]' : 'text-[#f8fafc]'
        )}>
          {task.title}
        </p>
        {task.dueTime && (
          <p className="text-xs text-[#94a3b8] flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {task.dueTime}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {task.priority && (
          <Badge
            variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}
            size="sm"
          >
            {task.priority === 'high' ? 'דחוף' : task.priority === 'medium' ? 'בינוני' : 'נמוך'}
          </Badge>
        )}
        {task.dueDate && !isOverdueItem && (
          <span className="text-xs text-[#64748b]">
            {formatRelativeDate(task.dueDate)}
          </span>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-6"
    >
      <h2 className="text-xl font-bold text-[#f8fafc] mb-6 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#3B82F6]" />
        אזור פעיל
      </h2>

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
            <h3 className="text-sm font-semibold text-[#ef4444]">
              באיחור ({overdueTasks.length})
            </h3>
          </div>
          <div className="space-y-2">
            {sortTasks(overdueTasks).map(task => (
              <TaskItem key={task.id} task={task} isOverdueItem />
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-[#94a3b8] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          היום ({todaysTasks.length})
        </h3>
        {todaysTasks.length > 0 ? (
          <div className="space-y-2">
            {sortTasks(todaysTasks).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <p className="text-[#64748b] text-sm py-4 text-center">
            אין משימות להיום 🎉
          </p>
        )}
      </div>

      {/* Upcoming */}
      {upcomingTasks.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#94a3b8] mb-3">
            בקרוב
          </h3>
          <div className="space-y-2">
            {sortTasks(upcomingTasks).map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
