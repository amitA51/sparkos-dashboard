'use client';

import { motion } from 'framer-motion';
import { Cloud, Sun, Moon, CloudRain } from 'lucide-react';
import { getHebrewGreeting, formatHebrewDate } from '@/lib/utils/date';

interface GreetingProps {
  name?: string;
}

export function Greeting({ name = 'משתמש' }: GreetingProps) {
  const greeting = getHebrewGreeting();
  const today = formatHebrewDate(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold text-[#f8fafc] mb-2"
          >
            {greeting}, <span className="gradient-text">{name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#94a3b8] text-lg"
          >
            {today}
          </motion.p>
        </div>

        {/* Weather Widget (placeholder) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0d0d14] border border-[#1e293b]"
        >
          <Sun className="w-8 h-8 text-[#f59e0b]" />
          <div className="text-left">
            <p className="text-2xl font-semibold text-[#f8fafc]">24°</p>
            <p className="text-xs text-[#94a3b8]">תל אביב</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
