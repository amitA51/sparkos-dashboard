'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  Search,
  CheckSquare,
  Repeat,
  FileText,
  Lightbulb,
  GraduationCap,
  BookOpen,
  Link as LinkIcon,
  Plus,
  LayoutDashboard,
  Settings,
  Zap,
  X,
  ArrowRight,
  Hash,
  Sparkles,
  Target,
  Flame
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/uiStore';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  category: 'navigation' | 'action' | 'item';
  keywords?: string[];
  color?: string;
  gradient?: string;
}

const categoryConfig = {
  navigation: {
    title: 'ניווט',
    icon: LayoutDashboard,
    color: 'text-blue-400'
  },
  action: {
    title: 'פעולות מהירות',
    icon: Zap,
    color: 'text-amber-400'
  },
  item: {
    title: 'פריטים אחרונים',
    icon: Hash,
    color: 'text-purple-400'
  }
};

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { items } = useItemsStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'nav-dashboard',
      label: 'דשבורד',
      description: 'חזור לעמוד הראשי',
      icon: LayoutDashboard,
      action: () => router.push('/'),
      category: 'navigation',
      keywords: ['home', 'main', 'ראשי'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'nav-tasks',
      label: 'משימות',
      description: 'ניהול משימות יומיות',
      icon: Target,
      action: () => router.push('/tasks'),
      category: 'navigation',
      keywords: ['tasks', 'todo'],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'nav-habits',
      label: 'הרגלים',
      description: 'מעקב אחר הרגלים',
      icon: Flame,
      action: () => router.push('/habits'),
      category: 'navigation',
      keywords: ['habits', 'daily'],
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 'nav-notes',
      label: 'פתקים',
      description: 'פתקים ורשימות',
      icon: FileText,
      action: () => router.push('/notes'),
      category: 'navigation',
      keywords: ['notes'],
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      id: 'nav-ideas',
      label: 'רעיונות',
      description: 'בנק הרעיונות שלך',
      icon: Lightbulb,
      action: () => router.push('/ideas'),
      category: 'navigation',
      keywords: ['ideas'],
      gradient: 'from-amber-500 to-yellow-500'
    },
    {
      id: 'nav-learnings',
      label: 'למידה',
      description: 'תובנות ולמידה',
      icon: GraduationCap,
      action: () => router.push('/learnings'),
      category: 'navigation',
      keywords: ['learning', 'insights'],
      gradient: 'from-purple-500 to-violet-500'
    },
    {
      id: 'nav-journal',
      label: 'יומן',
      description: 'יומן אישי',
      icon: BookOpen,
      action: () => router.push('/journal'),
      category: 'navigation',
      keywords: ['journal', 'diary'],
      gradient: 'from-emerald-500 to-green-500'
    },
    {
      id: 'nav-settings',
      label: 'הגדרות',
      description: 'הגדרות מערכת',
      icon: Settings,
      action: () => router.push('/settings'),
      category: 'navigation',
      keywords: ['settings', 'config'],
      gradient: 'from-slate-500 to-zinc-500'
    },

    // Actions
    {
      id: 'action-new-task',
      label: 'משימה חדשה',
      description: 'צור משימה חדשה',
      icon: Plus,
      action: () => router.push('/tasks'),
      category: 'action',
      keywords: ['new', 'create', 'add', 'חדש'],
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'action-new-note',
      label: 'פתק חדש',
      description: 'צור פתק חדש',
      icon: Plus,
      action: () => router.push('/notes'),
      category: 'action',
      keywords: ['new', 'create', 'add'],
      gradient: 'from-cyan-500 to-teal-500'
    },
    {
      id: 'action-focus',
      label: 'מצב מיקוד',
      description: 'הפעל מצב זן',
      icon: Sparkles,
      action: () => useUIStore.getState().toggleFocusMode(),
      category: 'action',
      keywords: ['focus', 'zen'],
      gradient: 'from-purple-500 to-pink-500'
    },
  ];

  // Add recent items to commands
  const recentItems: CommandItem[] = items.slice(0, 5).map(item => ({
    id: `item-${item.id}`,
    label: item.title,
    description: item.type === 'task' ? 'משימה' :
                 item.type === 'habit' ? 'הרגל' :
                 item.type === 'note' ? 'פתק' :
                 item.type === 'idea' ? 'רעיון' :
                 item.type === 'learning' ? 'למידה' :
                 item.type === 'journal' ? 'יומן' : 'קישור',
    icon: item.type === 'task' ? CheckSquare :
          item.type === 'habit' ? Repeat :
          item.type === 'note' ? FileText :
          item.type === 'idea' ? Lightbulb :
          item.type === 'learning' ? GraduationCap :
          item.type === 'journal' ? BookOpen : LinkIcon,
    action: () => {},
    category: 'item' as const,
    keywords: [item.type],
    gradient: item.type === 'task' ? 'from-blue-500 to-indigo-500' :
              item.type === 'habit' ? 'from-orange-500 to-amber-500' :
              item.type === 'note' ? 'from-cyan-500 to-teal-500' :
              item.type === 'idea' ? 'from-amber-500 to-yellow-500' :
              item.type === 'learning' ? 'from-purple-500 to-violet-500' :
              item.type === 'journal' ? 'from-emerald-500 to-green-500' : 'from-cyan-500 to-blue-500'
  }));

  const allCommands = [...commands, ...recentItems];

  // Filter commands based on query
  const filteredCommands = query
    ? allCommands.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.keywords?.some(k => k.toLowerCase().includes(query.toLowerCase()))
      )
    : allCommands;

  // Group commands by category
  const navigationCommands = filteredCommands.filter(c => c.category === 'navigation');
  const actionCommands = filteredCommands.filter(c => c.category === 'action');
  const itemCommands = filteredCommands.filter(c => c.category === 'item');

  const handleSelect = useCallback((command: CommandItem) => {
    command.action();
    setCommandPaletteOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, [setCommandPaletteOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredCommands, selectedIndex, handleSelect, setCommandPaletteOpen]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!commandPaletteOpen) return null;

  const renderGroup = (categoryKey: 'navigation' | 'action' | 'item', commands: CommandItem[], startIndex: number) => {
    if (commands.length === 0) return null;
    const config = categoryConfig[categoryKey];

    return (
      <div className="mb-2">
        <div className="flex items-center gap-2 px-4 py-2">
          <config.icon className={cn('w-3 h-3', config.color)} />
          <span className={cn('text-xs font-bold uppercase tracking-wider', config.color)}>
            {config.title}
          </span>
        </div>
        {commands.map((cmd, i) => {
          const globalIndex = startIndex + i;
          const isSelected = globalIndex === selectedIndex;

          return (
            <motion.button
              key={cmd.id}
              onClick={() => handleSelect(cmd)}
              whileHover={{ x: -4 }}
              className={cn(
                'w-full flex items-center gap-4 px-4 py-3 text-right transition-all duration-200 group',
                isSelected
                  ? 'bg-gradient-to-r from-[#3B82F6]/15 to-[#8B5CF6]/10'
                  : 'hover:bg-white/[0.03]'
              )}
            >
              {/* Icon with gradient */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 3 }}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  isSelected
                    ? `bg-gradient-to-br ${cmd.gradient}`
                    : 'bg-white/[0.05] group-hover:bg-white/[0.08]'
                )}
              >
                <cmd.icon className={cn(
                  'w-4 h-4',
                  isSelected ? 'text-white' : 'text-[#94a3b8] group-hover:text-[#f8fafc]'
                )} />
              </motion.div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'font-medium truncate',
                  isSelected ? 'text-[#f8fafc]' : 'text-[#94a3b8] group-hover:text-[#f8fafc]'
                )}>
                  {cmd.label}
                </p>
                {cmd.description && (
                  <p className="text-xs text-[#64748b] truncate">
                    {cmd.description}
                  </p>
                )}
              </div>

              {/* Action indicator */}
              <div className={cn(
                'flex items-center gap-2 transition-opacity',
                isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              )}>
                {isSelected ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.05] text-[10px] text-[#64748b]">
                    Enter ↵
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-[#64748b]" />
                )}
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  layoutId="commandSelection"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[60%] bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6] rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
        onClick={() => {
          setCommandPaletteOpen(false);
          setQuery('');
        }}
      >
        {/* Backdrop with blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-gradient-to-br from-[#0c0c12]/98 to-[#0a0a10]/98 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]"
              >
                <Command className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-sm font-bold text-[#f8fafc]">Command Palette</span>
            </div>
            <button
              onClick={() => {
                setCommandPaletteOpen(false);
                setQuery('');
              }}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-[#64748b] hover:text-[#f8fafc] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
            <Search className="w-5 h-5 text-[#3B82F6]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="חפש פקודות, עמודים, פריטים..."
              autoFocus
              className="flex-1 bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-lg"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[10px] text-[#64748b] font-mono">
              <span>ESC</span>
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto py-2 hide-scrollbar">
            {filteredCommands.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-12 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] flex items-center justify-center">
                  <Search className="w-8 h-8 text-[#64748b]" />
                </div>
                <p className="text-[#64748b] font-medium">לא נמצאו תוצאות</p>
                <p className="text-[#475569] text-sm mt-1">נסה לחפש משהו אחר</p>
              </motion.div>
            ) : (
              <>
                {renderGroup('navigation', navigationCommands, 0)}
                {renderGroup('action', actionCommands, navigationCommands.length)}
                {renderGroup('item', itemCommands, navigationCommands.length + actionCommands.length)}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="relative flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-[#0a0a0f]/50">
            <div className="flex items-center gap-4 text-xs text-[#64748b]">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">↓</kbd>
                ניווט
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">↵</kbd>
                בחירה
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] font-mono">ESC</kbd>
                סגירה
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
              </motion.div>
              <span className="text-xs font-bold gradient-text">SparkOS</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
