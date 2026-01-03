'use client';

import { motion } from 'framer-motion';
import { CheckSquare, Repeat, FileText, Lightbulb, Mail } from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';

export function StatsPanel() {
  const { items } = useItemsStore();

  const stats = [
    {
      label: 'משימות פעילות',
      value: items.filter(i => i.type === 'task' && !('isCompleted' in i && i.isCompleted)).length,
      icon: CheckSquare,
      color: 'text-[#3B82F6]',
      bgColor: 'bg-[#3B82F6]/10'
    },
    {
      label: 'הרגלים',
      value: items.filter(i => i.type === 'habit').length,
      icon: Repeat,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10'
    },
    {
      label: 'פתקים',
      value: items.filter(i => i.type === 'note').length,
      icon: FileText,
      color: 'text-[#22c55e]',
      bgColor: 'bg-[#22c55e]/10'
    },
    {
      label: 'רעיונות',
      value: items.filter(i => i.type === 'idea').length,
      icon: Lightbulb,
      color: 'text-[#f59e0b]',
      bgColor: 'bg-[#f59e0b]/10'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[#0d0d14] border border-[#1e293b] rounded-xl p-4 card-hover"
        >
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', stat.bgColor)}>
            <stat.icon className={cn('w-5 h-5', stat.color)} />
          </div>
          <p className="text-2xl font-bold text-[#f8fafc]">{stat.value}</p>
          <p className="text-sm text-[#94a3b8]">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
