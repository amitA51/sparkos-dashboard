'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sunrise, Sunset, Sparkles, Coffee, Zap, Brain, Target, Flame } from 'lucide-react';
import { getHebrewGreeting, formatHebrewDate } from '@/lib/utils/date';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { useMemo, useState, useEffect } from 'react';

interface GreetingProps {
  name?: string;
}

const motivationalQuotes = [
  'כל יום הוא הזדמנות חדשה',
  'צעד קטן כל יום מוביל להישגים גדולים',
  'אתה יכול לעשות את זה!',
  'התמקד במטרה, התעלם מהרעש',
  'ההצלחה היא סכום של מאמצים קטנים',
  'תתחיל מאיפה שאתה, עם מה שיש לך',
  'כל מסע מתחיל בצעד אחד',
  'היום הוא היום שלך!',
];

export function Greeting({ name = 'משתמש' }: GreetingProps) {
  const greeting = getHebrewGreeting();
  const today = formatHebrewDate(new Date());
  const { items } = useItemsStore();
  const [quote, setQuote] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Random quote on mount
  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  const hour = currentTime.getHours();

  const getTimeIcon = () => {
    if (hour >= 5 && hour < 8) return <Sunrise className="w-6 h-6 text-orange-400" />;
    if (hour >= 8 && hour < 17) return <Sun className="w-6 h-6 text-amber-400" />;
    if (hour >= 17 && hour < 20) return <Sunset className="w-6 h-6 text-orange-500" />;
    return <Moon className="w-6 h-6 text-indigo-400" />;
  };

  const getTimeMessage = () => {
    if (hour >= 5 && hour < 8) return 'זמן מושלם להתחיל את היום';
    if (hour >= 8 && hour < 12) return 'בוקר פרודוקטיבי!';
    if (hour >= 12 && hour < 14) return 'הגיע הזמן להפסקת צהריים?';
    if (hour >= 14 && hour < 17) return 'אחרהצ של יצירה';
    if (hour >= 17 && hour < 20) return 'מסיימים את היום חזק!';
    if (hour >= 20 && hour < 23) return 'זמן לסיכום היום';
    return 'לילה טוב, מנוחה חשובה!';
  };

  // Calculate today's stats
  const todayStats = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];

    const tasks = items.filter(i => i.type === 'task');
    const todayTasks = tasks.filter(t => {
      const task = t as typeof t & { dueDate?: string };
      return task.dueDate?.startsWith(todayStr);
    });
    const completedTasks = todayTasks.filter(t => {
      const task = t as typeof t & { isCompleted?: boolean };
      return task.isCompleted;
    });

    const habits = items.filter(i => i.type === 'habit');
    const completedHabits = habits.filter(h => {
      const habit = h as typeof h & { lastCompletedDate?: string };
      return habit.lastCompletedDate === todayStr;
    });

    const totalStreak = habits.reduce((acc, h) => {
      const habit = h as typeof h & { streak?: number };
      return acc + (habit.streak || 0);
    }, 0);

    return {
      tasksCompleted: completedTasks.length,
      tasksTotal: todayTasks.length,
      habitsCompleted: completedHabits.length,
      habitsTotal: habits.length,
      totalStreak,
    };
  }, [items]);

  const completionRate = useMemo(() => {
    const total = todayStats.tasksTotal + todayStats.habitsTotal;
    const completed = todayStats.tasksCompleted + todayStats.habitsCompleted;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  }, [todayStats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl blur-3xl -z-10" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Main greeting */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 mb-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {getTimeIcon()}
            </motion.div>
            <span className="text-sm font-medium text-[#94a3b8]">{getTimeMessage()}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl lg:text-4xl font-bold text-[#f8fafc] mb-2"
          >
            {greeting},{' '}
            <span className="relative">
              <span className="gradient-text">{name}</span>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-1 -right-6"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
              </motion.span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <p className="text-[#94a3b8]">{today}</p>
            <span className="text-[#3B82F6]">•</span>
            <p className="text-[#64748b] text-sm italic">{quote}</p>
          </motion.div>
        </div>

        {/* Quick Stats Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-3"
        >
          {/* Completion Rate */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-[#0c0c12]/90 to-[#0a0a10]/90 backdrop-blur-xl border border-white/[0.06]">
            <div className="relative">
              <svg width="48" height="48" className="transform -rotate-90">
                <circle
                  cx="24" cy="24" r="18"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="4"
                />
                <motion.circle
                  cx="24" cy="24" r="18"
                  fill="none"
                  stroke="url(#miniGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 18}
                  initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - completionRate / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="miniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-[#f8fafc]">{completionRate}%</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-[#64748b]">התקדמות</p>
              <p className="text-sm font-semibold text-[#f8fafc]">היום</p>
            </div>
          </div>

          {/* Tasks */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-[#0c0c12]/90 to-[#0a0a10]/90 backdrop-blur-xl border border-white/[0.06]">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5">
              <Target className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">משימות</p>
              <p className="text-lg font-bold text-[#f8fafc]">
                {todayStats.tasksCompleted}
                <span className="text-[#64748b] text-sm font-normal">/{todayStats.tasksTotal}</span>
              </p>
            </div>
          </div>

          {/* Habits */}
          <div className="hidden md:flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-[#0c0c12]/90 to-[#0a0a10]/90 backdrop-blur-xl border border-white/[0.06]">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5">
              <Flame className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">הרגלים</p>
              <p className="text-lg font-bold text-[#f8fafc]">
                {todayStats.habitsCompleted}
                <span className="text-[#64748b] text-sm font-normal">/{todayStats.habitsTotal}</span>
              </p>
            </div>
          </div>

          {/* Streak (hidden on small screens) */}
          {todayStats.totalStreak > 0 && (
            <div className="hidden lg:flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 backdrop-blur-xl border border-amber-500/20">
              <Flame className="w-6 h-6 text-orange-400 animate-fire" />
              <div>
                <p className="text-xs text-amber-400/70">Total Streak</p>
                <p className="text-lg font-bold streak-fire">{todayStats.totalStreak}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
