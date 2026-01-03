'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Lightbulb,
  GraduationCap,
  BookOpen,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  Radio,
  Zap,
  Plus
} from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';
import type { NoteItem, IdeaItem, LearningItem, JournalItem, LinkItem } from '@/lib/types';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

const typeConfig = {
  note: {
    icon: FileText,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/20 to-cyan-500/10',
    color: 'text-blue-400',
    label: 'פתק',
    href: '/notes'
  },
  idea: {
    icon: Lightbulb,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-500/20 to-orange-500/10',
    color: 'text-amber-400',
    label: 'רעיון',
    href: '/ideas'
  },
  learning: {
    icon: GraduationCap,
    gradient: 'from-purple-500 to-violet-500',
    bgGradient: 'from-purple-500/20 to-violet-500/10',
    color: 'text-purple-400',
    label: 'למידה',
    href: '/learnings'
  },
  journal: {
    icon: BookOpen,
    gradient: 'from-emerald-500 to-green-500',
    bgGradient: 'from-emerald-500/20 to-green-500/10',
    color: 'text-emerald-400',
    label: 'יומן',
    href: '/journal'
  },
  link: {
    icon: LinkIcon,
    gradient: 'from-cyan-500 to-teal-500',
    bgGradient: 'from-cyan-500/20 to-teal-500/10',
    color: 'text-cyan-400',
    label: 'קישור',
    href: '/links'
  },
};

interface StreamCardProps {
  item: any;
  index: number;
}

function StreamCard({ item, index }: StreamCardProps) {
  const config = typeConfig[item.type as keyof typeof typeConfig];
  if (!config) return null;

  const Icon = config.icon;
  const timeAgo = item.createdAt ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: he }) : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative group h-full"
    >
      {/* Glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10',
        `bg-gradient-to-br ${config.gradient}`
      )} />

      <div className="relative h-full bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-xl border border-white/[0.08] group-hover:border-white/[0.15] rounded-2xl p-5 overflow-hidden transition-all duration-300">
        {/* Background gradient accent */}
        <div className={cn(
          'absolute top-0 left-0 w-full h-full opacity-5 group-hover:opacity-10 transition-opacity',
          `bg-gradient-to-br ${config.bgGradient}`
        )} />

        {/* Type badge + time */}
        <div className="relative flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className={cn('p-2.5 rounded-xl bg-gradient-to-br shadow-lg', config.gradient)}
          >
            <Icon className="w-4 h-4 text-white" />
          </motion.div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#64748b] font-medium">{timeAgo}</span>
            <div className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide',
              `bg-gradient-to-r ${config.bgGradient} ${config.color}`
            )}>
              {config.label}
            </div>
          </div>
        </div>

        {/* Title */}
        <h4 className="relative font-bold text-[#f8fafc] mb-2 line-clamp-2 group-hover:text-white transition-colors">
          {item.title}
        </h4>

        {/* Content preview */}
        {item.content && (
          <p className="relative text-sm text-[#64748b] line-clamp-3 mb-4 group-hover:text-[#94a3b8] transition-colors">
            {item.content}
          </p>
        )}

        {/* Link URL for link items */}
        {item.type === 'link' && item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 truncate mb-4"
          >
            <ExternalLink className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{item.url}</span>
          </a>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="relative flex flex-wrap gap-1.5 mt-auto">
            {item.tags.slice(0, 3).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full bg-white/[0.05] text-[10px] text-[#94a3b8] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Hover shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Hover arrow indicator */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileHover={{ opacity: 1, x: 0 }}
          className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#64748b]" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function TheStream() {
  const { items } = useItemsStore();

  // Get notes, ideas, learnings, journals, links - sorted by date
  const streamItems = items
    .filter(item => ['note', 'idea', 'learning', 'journal', 'link'].includes(item.type))
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 8);

  if (streamItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-12 text-center overflow-hidden"
      >
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 flex items-center justify-center"
        >
          <Sparkles className="w-10 h-10 text-purple-400" />
        </motion.div>

        <h3 className="relative text-xl font-bold text-[#f8fafc] mb-2">הזרם שלך ריק</h3>
        <p className="relative text-[#64748b] mb-6">פתקים, רעיונות ולמידה יופיעו כאן</p>

        <div className="relative flex flex-wrap justify-center gap-3">
          {Object.entries(typeConfig).slice(0, 4).map(([key, config]) => (
            <Link
              key={key}
              href={config.href}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105',
                `bg-gradient-to-r ${config.gradient} text-white`
              )}
            >
              <Plus className="w-4 h-4" />
              {config.label}
            </Link>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20"
          >
            <Radio className="w-5 h-5 text-white" />
            {/* Live indicator */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-[#0a0a0f]" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-[#f8fafc] flex items-center gap-2">
              הזרם
              <span className="text-xs text-emerald-400 font-medium px-2 py-0.5 bg-emerald-500/20 rounded-full">
                LIVE
              </span>
            </h3>
            <p className="text-xs text-[#64748b]">הפריטים האחרונים שלך</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {Object.entries(typeConfig).slice(0, 3).map(([key, config]) => (
            <Link
              key={key}
              href={config.href}
              className={cn(
                'p-2 rounded-lg transition-all hover:scale-110',
                `bg-gradient-to-br ${config.bgGradient}`
              )}
            >
              <config.icon className={cn('w-4 h-4', config.color)} />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Stream Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {streamItems.map((item, index) => (
            <StreamCard key={item.id} item={item} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* View more link */}
      {streamItems.length >= 8 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] text-[#94a3b8] hover:text-[#f8fafc] text-sm font-medium transition-all"
          >
            הצג עוד פריטים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
