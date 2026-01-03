'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  FileText,
  Lightbulb,
  GraduationCap,
  BookOpen,
  Link as LinkIcon,
  Settings,
  ChevronRight,
  Zap,
  Command
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/lib/stores/uiStore';

const navigation = [
  { name: 'דשבורד', href: '/', icon: LayoutDashboard, color: 'from-blue-500 to-cyan-500' },
  { name: 'משימות', href: '/tasks', icon: CheckSquare, color: 'from-blue-500 to-indigo-500' },
  { name: 'הרגלים', href: '/habits', icon: Flame, color: 'from-orange-500 to-amber-500' },
  { name: 'פתקים', href: '/notes', icon: FileText, color: 'from-cyan-500 to-teal-500' },
  { name: 'רעיונות', href: '/ideas', icon: Lightbulb, color: 'from-amber-500 to-yellow-500' },
  { name: 'למידה', href: '/learnings', icon: GraduationCap, color: 'from-purple-500 to-violet-500' },
  { name: 'יומן', href: '/journal', icon: BookOpen, color: 'from-emerald-500 to-green-500' },
  { name: 'קישורים', href: '/links', icon: LinkIcon, color: 'from-cyan-500 to-blue-500' },
];

const bottomNavigation = [
  { name: 'הגדרות', href: '/settings', icon: Settings, color: 'from-slate-500 to-zinc-500' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setCommandPaletteOpen } = useUIStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex flex-col h-screen bg-gradient-to-b from-[#0a0a0f] via-[#0c0c12] to-[#0a0a0f] border-l border-white/[0.06] fixed right-0 top-0 z-30"
      >
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center justify-between p-4 border-b border-white/[0.06]">
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#6366f1] to-[#8B5CF6] shadow-lg shadow-blue-500/25"
                >
                  <Zap className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <span className="text-xl font-bold gradient-text">SparkOS</span>
                  <p className="text-[10px] text-[#64748b] font-medium">Life Operating System</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!sidebarOpen && (
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="mx-auto p-2.5 rounded-xl bg-gradient-to-br from-[#3B82F6] via-[#6366f1] to-[#8B5CF6] shadow-lg shadow-blue-500/25"
            >
              <Zap className="w-5 h-5 text-white" />
            </motion.div>
          )}

          {sidebarOpen && (
            <motion.button
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#94a3b8] hover:text-[#f8fafc] transition-colors border border-white/[0.04]"
            >
              <motion.div
                animate={{ rotate: sidebarOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
        </div>

        {/* Command Palette Shortcut */}
        {sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCommandPaletteOpen(true)}
            className="relative mx-3 mt-4 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-white/[0.03] to-white/[0.01] rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all group"
          >
            <Command className="w-4 h-4 text-[#64748b] group-hover:text-[#94a3b8]" />
            <span className="text-sm text-[#64748b] group-hover:text-[#94a3b8]">חיפוש מהיר...</span>
            <kbd className="mr-auto flex items-center gap-0.5 px-2 py-0.5 bg-white/[0.05] rounded text-[10px] text-[#64748b] font-mono">
              <span>⌘</span><span>K</span>
            </kbd>
          </motion.button>
        )}

        {/* Navigation */}
        <nav className="relative flex-1 p-3 space-y-1 overflow-y-auto hide-scrollbar">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ x: -4 }}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-gradient-to-r from-[#3B82F6]/15 to-[#8B5CF6]/10'
                      : 'hover:bg-white/[0.03]'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-gradient-to-b from-[#3B82F6] to-[#8B5CF6] rounded-full"
                    />
                  )}

                  {/* Icon with gradient background on active */}
                  <div className={cn(
                    'p-2 rounded-lg transition-all duration-200',
                    isActive
                      ? `bg-gradient-to-br ${item.color} shadow-lg`
                      : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                  )}>
                    <item.icon className={cn(
                      'w-4 h-4',
                      isActive ? 'text-white' : 'text-[#94a3b8] group-hover:text-[#f8fafc]'
                    )} />
                  </div>

                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className={cn(
                          'font-medium whitespace-nowrap overflow-hidden',
                          isActive ? 'text-[#f8fafc]' : 'text-[#94a3b8] group-hover:text-[#f8fafc]'
                        )}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Hover glow effect */}
                  <div className={cn(
                    'absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none',
                    'group-hover:opacity-100',
                    isActive && 'opacity-100'
                  )} style={{
                    background: isActive
                      ? 'radial-gradient(ellipse at right, rgba(59, 130, 246, 0.1), transparent 70%)'
                      : 'radial-gradient(ellipse at right, rgba(255, 255, 255, 0.02), transparent 70%)'
                  }} />
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="relative p-3 border-t border-white/[0.06]">
          {bottomNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: -4 }}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                    isActive
                      ? 'bg-white/[0.05]'
                      : 'hover:bg-white/[0.03]'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-lg transition-all',
                    isActive ? 'bg-white/[0.08]' : 'bg-white/[0.03] group-hover:bg-white/[0.06]'
                  )}>
                    <item.icon className="w-4 h-4 text-[#94a3b8] group-hover:text-[#f8fafc]" />
                  </div>
                  <AnimatePresence mode="wait">
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium whitespace-nowrap overflow-hidden text-[#94a3b8] group-hover:text-[#f8fafc]"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}

          {/* Collapse button when sidebar is closed */}
          {!sidebarOpen && (
            <motion.button
              onClick={toggleSidebar}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="mt-2 w-full p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-[#94a3b8] hover:text-[#f8fafc] transition-colors flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
            </motion.button>
          )}
        </div>

        {/* Version badge */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-center"
          >
            <span className="text-[10px] text-[#475569] font-mono">v2.0.0 • Premium</span>
          </motion.div>
        )}
      </motion.aside>
    </>
  );
}
