'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, Circle, Clock, AlertTriangle, Trash2, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { formatRelativeDate, isOverdue } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import type { TaskItem } from '@/lib/types';

export default function TasksPage() {
  const { items, completeItem, deleteItem, addItem } = useItemsStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const tasks = items.filter(item => item.type === 'task') as TaskItem[];

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const overdueTasks = filteredTasks.filter(t => !t.isCompleted && t.dueDate && isOverdue(t.dueDate));
  const activeTasks = filteredTasks.filter(t => !t.isCompleted && (!t.dueDate || !isOverdue(t.dueDate)));
  const completedTasks = filteredTasks.filter(t => t.isCompleted);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    await addItem({
      type: 'task',
      title: newTaskTitle,
      isCompleted: false,
    } as any);

    setNewTaskTitle('');
    setShowAddForm(false);
  };

  const TaskCard = ({ task }: { task: TaskItem }) => {
    const overdue = task.dueDate && isOverdue(task.dueDate);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -100 }}
        whileHover={{ x: -4 }}
        className={cn(
          'flex items-center gap-4 p-4 rounded-xl border transition-all',
          task.isCompleted
            ? 'bg-[#12121a]/50 border-[#1e293b]/50'
            : overdue
              ? 'bg-[#ef4444]/10 border-[#ef4444]/30'
              : 'bg-[#12121a] border-[#1e293b] hover:border-[#3B82F6]/30'
        )}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => completeItem(task.id)}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
            task.isCompleted
              ? 'bg-[#22c55e] border-[#22c55e]'
              : overdue
                ? 'border-[#ef4444] hover:bg-[#ef4444]/20'
                : 'border-[#3B82F6] hover:bg-[#3B82F6]/20'
          )}
        >
          {task.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
        </motion.button>

        <div className="flex-1 min-w-0">
          <p className={cn(
            'font-medium truncate',
            task.isCompleted ? 'text-[#64748b] line-through' : 'text-[#f8fafc]'
          )}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            {task.dueDate && (
              <span className={cn(
                'text-xs flex items-center gap-1',
                overdue ? 'text-[#ef4444]' : 'text-[#94a3b8]'
              )}>
                <Clock className="w-3 h-3" />
                {formatRelativeDate(task.dueDate)}
                {task.dueTime && ` ${task.dueTime}`}
              </span>
            )}
            {task.priority && (
              <Badge
                variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'default'}
                size="sm"
              >
                {task.priority === 'high' ? 'דחוף' : task.priority === 'medium' ? 'בינוני' : 'נמוך'}
              </Badge>
            )}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => deleteItem(task.id)}
          className="p-2 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc]">משימות</h1>
          <p className="text-[#94a3b8] mt-1">
            {activeTasks.length} פעילות • {completedTasks.length} הושלמו
          </p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          משימה חדשה
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              filter === f
                ? 'bg-[#3B82F6] text-white'
                : 'bg-[#12121a] text-[#94a3b8] hover:text-[#f8fafc] border border-[#1e293b]'
            )}
          >
            {f === 'all' ? 'הכל' : f === 'active' ? 'פעילות' : 'הושלמו'}
          </button>
        ))}
      </div>

      {/* Add Task Form */}
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
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  placeholder="מה צריך לעשות?"
                  autoFocus
                  className="flex-1 bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-lg"
                />
                <Button onClick={handleAddTask} size="sm">
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

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
            <h2 className="text-sm font-semibold text-[#ef4444]">
              באיחור ({overdueTasks.length})
            </h2>
          </div>
          <div className="space-y-2">
            <AnimatePresence>
              {overdueTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-[#94a3b8] mb-3">
            פעילות ({activeTasks.length})
          </h2>
          <div className="space-y-2">
            <AnimatePresence>
              {activeTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && filter !== 'active' && (
        <div>
          <h2 className="text-sm font-semibold text-[#94a3b8] mb-3">
            הושלמו ({completedTasks.length})
          </h2>
          <div className="space-y-2">
            <AnimatePresence>
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a25] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[#64748b]" />
          </div>
          <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">אין משימות</h3>
          <p className="text-[#94a3b8] mb-4">הוסף משימה חדשה כדי להתחיל</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-5 h-5" />
            משימה חדשה
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
