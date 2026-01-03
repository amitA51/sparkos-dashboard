'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { useUIStore } from '@/lib/stores/uiStore';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarOpen, focusMode } = useUIStore();
  const { subscribe } = useItemsStore();

  // Subscribe to Firebase on mount
  useEffect(() => {
    const unsubscribe = subscribe();
    return () => unsubscribe();
  }, [subscribe]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        useUIStore.getState().toggleCommandPalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-[#050505]">
      {/* Command Palette */}
      <CommandPalette />

      {/* Sidebar (Desktop) */}
      <Sidebar />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Focus Mode Overlay */}
      {focusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="focus-overlay"
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen transition-all duration-300',
          // Desktop: adjust for sidebar
          sidebarOpen ? 'lg:mr-60' : 'lg:mr-[72px]',
          // Mobile: add top padding for header
          'pt-16 lg:pt-0',
          // Padding
          'p-4 lg:p-6'
        )}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
