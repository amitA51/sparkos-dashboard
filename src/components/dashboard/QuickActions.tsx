'use client';

import { motion } from 'framer-motion';
import {
  Plus,
  CheckSquare,
  Flame,
  FileText,
  Lightbulb,
  BookOpen,
  Link2,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/uiStore';

const actions = [
  {
    id: 'task',
    label: 'משימה חדשה',
    icon: CheckSquare,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    href: '/tasks'
  },
  {
    id: 'habit',
    label: 'הרגל חדש',
    icon: Flame,
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    href: '/habits'
  },
  {
    id: 'note',
    label: 'פתק מהיר',
    icon: FileText,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    href: '/notes'
  },
  {
    id: 'idea',
    label: 'רעיון',
    icon: Lightbulb,
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    href: '/ideas'
  },
  {
    id: 'learning',
    label: 'תובנה',
    icon: BookOpen,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    href: '/learnings'
  },
  {
    id: 'link',
    label: 'קישור',
    icon: Link2,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    href: '/links'
  }
];

export function QuickActions() {
  const router = useRouter();
  const { setCommandPaletteOpen } = useUIStore();

  return (
    <div className="flex flex-wrap gap-2 md:gap-3">
      {/* Command Palette Trigger */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCommandPaletteOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] via-[#6366f1] to-[#8B5CF6] rounded-xl text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-shadow"
      >
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">פקודה מהירה</span>
        <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded text-xs font-mono">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </motion.button>

      {/* Quick Action Buttons */}
      {actions.map((action) => (
        <motion.button
          key={action.id}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(action.href)}
          className={`
            flex items-center gap-2 px-3 py-2.5
            bg-[#0c0c12]/80 backdrop-blur-sm
            border border-white/[0.06] hover:border-white/[0.12]
            rounded-xl
            ${action.textColor}
            font-medium text-sm
            transition-all duration-200
            hover:shadow-lg
          `}
        >
          <action.icon className="w-4 h-4" />
          <span className="hidden lg:inline">{action.label}</span>
        </motion.button>
      ))}
    </div>
  );
}
