'use client';

import { motion } from 'framer-motion';

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Greeting Skeleton */}
      <div className="mb-8">
        <div className="h-10 w-64 bg-[#1e293b] rounded-lg mb-2" />
        <div className="h-5 w-40 bg-[#1e293b] rounded-lg" />
      </div>

      {/* Brain Dump Skeleton */}
      <div className="h-14 w-full bg-[#0d0d14] border border-[#1e293b] rounded-2xl" />

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-[#0d0d14] border border-[#1e293b] rounded-xl p-4 h-28" />
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-6 h-80" />
        </div>
        <div className="space-y-6">
          <div className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-6 h-64" />
          <div className="bg-[#0d0d14] border border-[#1e293b] rounded-2xl p-6 h-48" />
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse bg-[#0d0d14] border border-[#1e293b] rounded-xl p-4">
      <div className="h-4 w-3/4 bg-[#1e293b] rounded mb-2" />
      <div className="h-3 w-1/2 bg-[#1e293b] rounded" />
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 p-3 bg-[#12121a] border border-[#1e293b] rounded-xl">
      <div className="w-5 h-5 rounded-full bg-[#1e293b]" />
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-[#1e293b] rounded mb-1" />
        <div className="h-3 w-1/4 bg-[#1e293b] rounded" />
      </div>
    </div>
  );
}
