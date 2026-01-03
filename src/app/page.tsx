'use client';

import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout';
import {
  Greeting,
  DailyScore,
  ActiveZone,
  TheStream,
  HabitsPanel,
  StatsPanel,
  QuickActions
} from '@/components/dashboard';
import { BrainDumpInput } from '@/components/shared';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { Zap } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const
    }
  }
};

export default function Home() {
  const { isLoading, items, error } = useItemsStore();

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Hero Section - Greeting + Brain Dump */}
        <motion.div variants={itemVariants} className="space-y-5">
          <Greeting name="עמית" />
          <BrainDumpInput />
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>

        {/* Bento Grid - Main Dashboard */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5"
        >
          {/* Daily Score - Prominent Position */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 lg:col-span-4 lg:row-span-2"
          >
            <DailyScore />
          </motion.div>

          {/* Stats Overview - Wide */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 lg:col-span-8"
          >
            <StatsPanel />
          </motion.div>

          {/* Habits Panel */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-1 lg:col-span-4 lg:row-span-2"
          >
            <HabitsPanel />
          </motion.div>

          {/* Active Zone - Main Content Area */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-8 lg:row-span-2"
          >
            <ActiveZone />
          </motion.div>
        </motion.div>

        {/* The Stream - Full Width */}
        <motion.div variants={itemVariants}>
          <TheStream />
        </motion.div>

        {/* Firebase Status - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            variants={itemVariants}
            className="p-4 bg-gradient-to-r from-[#0c0c12]/80 to-[#0a0a10]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-red-500' : isLoading ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <p className="text-sm text-[#94a3b8]">
                {isLoading ? (
                  'מתחבר ל-Firebase...'
                ) : error ? (
                  <span className="text-red-400">שגיאה: {error}</span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    מחובר - {items.length} פריטים מסונכרנים
                  </span>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
