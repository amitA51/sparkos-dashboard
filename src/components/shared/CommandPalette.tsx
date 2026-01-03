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
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/uiStore';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  category: 'navigation' | 'action' | 'item';
  keywords?: string[];
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const { items } = useItemsStore();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-dashboard', label: 'דשבורד', icon: LayoutDashboard, action: () => router.push('/'), category: 'navigation', keywords: ['home', 'main', 'ראשי'] },
    { id: 'nav-tasks', label: 'משימות', icon: CheckSquare, action: () => router.push('/tasks'), category: 'navigation', keywords: ['tasks', 'todo'] },
    { id: 'nav-habits', label: 'הרגלים', icon: Repeat, action: () => router.push('/habits'), category: 'navigation', keywords: ['habits', 'daily'] },
    { id: 'nav-notes', label: 'פתקים', icon: FileText, action: () => router.push('/notes'), category: 'navigation', keywords: ['notes'] },
    { id: 'nav-ideas', label: 'רעיונות', icon: Lightbulb, action: () => router.push('/ideas'), category: 'navigation', keywords: ['ideas'] },
    { id: 'nav-learnings', label: 'למידה', icon: GraduationCap, action: () => router.push('/learnings'), category: 'navigation', keywords: ['learning', 'insights'] },
    { id: 'nav-journal', label: 'יומן', icon: BookOpen, action: () => router.push('/journal'), category: 'navigation', keywords: ['journal', 'diary'] },
    { id: 'nav-settings', label: 'הגדרות', icon: Settings, action: () => router.push('/settings'), category: 'navigation', keywords: ['settings', 'config'] },

    // Actions
    { id: 'action-new-task', label: 'משימה חדשה', icon: Plus, action: () => {/* TODO: Open new task modal */}, category: 'action', keywords: ['new', 'create', 'add', 'חדש'] },
    { id: 'action-new-note', label: 'פתק חדש', icon: Plus, action: () => {/* TODO: Open new note modal */}, category: 'action', keywords: ['new', 'create', 'add'] },
    { id: 'action-focus', label: 'מצב מיקוד', icon: Zap, action: () => useUIStore.getState().toggleFocusMode(), category: 'action', keywords: ['focus', 'zen'] },
  ];

  // Add recent items to commands
  const recentItems: CommandItem[] = items.slice(0, 5).map(item => ({
    id: `item-${item.id}`,
    label: item.title,
    icon: item.type === 'task' ? CheckSquare :
          item.type === 'habit' ? Repeat :
          item.type === 'note' ? FileText :
          item.type === 'idea' ? Lightbulb :
          item.type === 'learning' ? GraduationCap :
          item.type === 'journal' ? BookOpen : LinkIcon,
    action: () => {/* TODO: Open item */},
    category: 'item' as const,
    keywords: [item.type]
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

  const renderGroup = (title: string, commands: CommandItem[], startIndex: number) => {
    if (commands.length === 0) return null;

    return (
      <div className="mb-4">
        <div className="px-4 py-2 text-xs font-semibold text-[#64748b] uppercase tracking-wider">
          {title}
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
                'w-full flex items-center gap-3 px-4 py-3 text-right transition-colors',
                isSelected
                  ? 'bg-[#3B82F6]/10 text-[#3B82F6]'
                  : 'text-[#f8fafc] hover:bg-[#1a1a25]'
              )}
            >
              <cmd.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{cmd.label}</span>
              {isSelected && (
                <span className="text-xs text-[#64748b]">Enter ↵</span>
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
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
        onClick={() => {
          setCommandPaletteOpen(false);
          setQuery('');
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-xl bg-[#0a0a0f] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-[#1e293b]">
            <Search className="w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="חפש פקודות, פריטים..."
              autoFocus
              className="flex-1 bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-lg"
            />
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#1e293b] text-xs text-[#64748b]">
              <Command className="w-3 h-3" />
              <span>K</span>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto py-2">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#64748b]">
                לא נמצאו תוצאות
              </div>
            ) : (
              <>
                {renderGroup('ניווט', navigationCommands, 0)}
                {renderGroup('פעולות', actionCommands, navigationCommands.length)}
                {renderGroup('פריטים אחרונים', itemCommands, navigationCommands.length + actionCommands.length)}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e293b] bg-[#0d0d14] text-xs text-[#64748b]">
            <div className="flex items-center gap-4">
              <span>↑↓ ניווט</span>
              <span>↵ בחירה</span>
              <span>Esc סגירה</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#3B82F6]" />
              <span>SparkOS</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
