'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  CheckSquare,
  Repeat,
  FileText,
  Lightbulb,
  GraduationCap,
  BookOpen,
  Link as LinkIcon,
  Command,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/lib/stores/uiStore';

const navigation = [
  { name: 'דשבורד', href: '/', icon: LayoutDashboard },
  { name: 'משימות', href: '/tasks', icon: CheckSquare },
  { name: 'הרגלים', href: '/habits', icon: Repeat },
  { name: 'פתקים', href: '/notes', icon: FileText },
  { name: 'רעיונות', href: '/ideas', icon: Lightbulb },
  { name: 'למידה', href: '/learnings', icon: GraduationCap },
  { name: 'יומן', href: '/journal', icon: BookOpen },
  { name: 'קישורים', href: '/links', icon: LinkIcon },
];

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { toggleCommandPalette } = useUIStore();

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-[#1e293b]">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SparkOS</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Command Palette Button */}
            <motion.button
              onClick={toggleCommandPalette}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-[#12121a] border border-[#1e293b] text-[#94a3b8]"
            >
              <Command className="w-5 h-5" />
            </motion.button>

            {/* Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-[#12121a] border border-[#1e293b] text-[#94a3b8]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
            />

            {/* Drawer */}
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-64 bg-[#0a0a0f] border-l border-[#1e293b] z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6]">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-bold gradient-text">SparkOS</span>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg hover:bg-[#1a1a25] text-[#94a3b8]"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-2">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                      >
                        <div
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                            isActive
                              ? 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/30'
                              : 'text-[#94a3b8] hover:bg-[#1a1a25] hover:text-[#f8fafc]'
                          )}
                        >
                          <item.icon className={cn('w-5 h-5', isActive && 'text-[#3B82F6]')} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
