'use client';

import { DashboardLayout } from '@/components/layout';
import {
  Greeting,
  DailyScore,
  ActiveZone,
  TheStream,
  HabitsPanel,
  StatsPanel
} from '@/components/dashboard';
import { BrainDumpInput } from '@/components/shared';
import { useItemsStore } from '@/lib/stores/itemsStore';

export default function Home() {
  const { isLoading, items, error } = useItemsStore();

  return (
    <DashboardLayout>
      {/* Greeting */}
      <Greeting name="עמית" />

      {/* Brain Dump Input */}
      <BrainDumpInput />

      {/* Stats Overview */}
      <StatsPanel />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Active Zone - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ActiveZone />
        </div>

        {/* Right Column - Score & Habits */}
        <div className="space-y-6">
          <DailyScore />
          <HabitsPanel />
        </div>
      </div>

      {/* The Stream */}
      <div className="mt-8">
        <TheStream />
      </div>

      {/* Debug Info (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-[#0d0d14] border border-[#1e293b] rounded-xl text-xs">
          <p className="text-[#94a3b8]">
            🔥 Firebase Status: {isLoading ? 'Loading...' : error ? `Error: ${error}` : `Connected - ${items.length} items`}
          </p>
        </div>
      )}
    </DashboardLayout>
  );
}
