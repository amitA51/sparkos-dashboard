'use client';

import { motion } from 'framer-motion';
import { FileText, Lightbulb, GraduationCap, BookOpen, Link as LinkIcon } from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
import type { NoteItem, IdeaItem, LearningItem, JournalItem, LinkItem } from '@/lib/types';

const typeConfig = {
  note: { icon: FileText, color: 'text-[#3B82F6]', bgColor: 'bg-[#3B82F6]/10', label: 'פתק' },
  idea: { icon: Lightbulb, color: 'text-[#f59e0b]', bgColor: 'bg-[#f59e0b]/10', label: 'רעיון' },
  learning: { icon: GraduationCap, color: 'text-[#8B5CF6]', bgColor: 'bg-[#8B5CF6]/10', label: 'למידה' },
  journal: { icon: BookOpen, color: 'text-[#22c55e]', bgColor: 'bg-[#22c55e]/10', label: 'יומן' },
  link: { icon: LinkIcon, color: 'text-[#06b6d4]', bgColor: 'bg-[#06b6d4]/10', label: 'קישור' },
};

export function TheStream() {
  const { items } = useItemsStore();

  // Get notes, ideas, learnings, journals, links - sorted by date
  const streamItems = items
    .filter(item => ['note', 'idea', 'learning', 'journal', 'link'].includes(item.type))
    .slice(0, 8);

  if (streamItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a25] flex items-center justify-center">
          <FileText className="w-8 h-8 text-[#64748b]" />
        </div>
        <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">הזרם שלך ריק</h3>
        <p className="text-[#94a3b8]">פתקים, רעיונות ולמידה יופיעו כאן</p>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#f8fafc] mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#8B5CF6]" />
        הזרם
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {streamItems.map((streamItem) => {
          const config = typeConfig[streamItem.type as keyof typeof typeConfig];
          if (!config) return null;

          const Icon = config.icon;

          return (
            <motion.div key={streamItem.id} variants={item}>
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', config.bgColor)}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="default" size="sm" className="mb-2">
                      {config.label}
                    </Badge>
                    <h4 className="font-medium text-[#f8fafc] mb-1 line-clamp-1">
                      {streamItem.title}
                    </h4>
                    {streamItem.content && (
                      <p className="text-sm text-[#94a3b8] line-clamp-2">
                        {streamItem.content}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
