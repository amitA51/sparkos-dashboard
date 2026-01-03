'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Send,
  Loader2,
  Wand2,
  CheckSquare,
  Repeat,
  FileText,
  Lightbulb,
  Clock,
  AlertTriangle,
  Calendar,
  Brain,
  Zap
} from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import toast from 'react-hot-toast';
import type { ItemType, Priority } from '@/lib/types';
import { cn } from '@/lib/utils/cn';

// Simple parser for natural language input
function parseInput(text: string): {
  type: ItemType;
  title: string;
  dueDate?: string;
  dueTime?: string;
  priority?: Priority;
} {
  let type: ItemType = 'task';
  let title = text;
  let dueDate: string | undefined;
  let dueTime: string | undefined;
  let priority: Priority | undefined;

  // Detect type
  if (text.includes('רעיון') || text.includes('idea')) {
    type = 'idea';
    title = text.replace(/רעיון[:\s]*/i, '').replace(/idea[:\s]*/i, '');
  } else if (text.includes('פתק') || text.includes('note')) {
    type = 'note';
    title = text.replace(/פתק[:\s]*/i, '').replace(/note[:\s]*/i, '');
  } else if (text.includes('הרגל') || text.includes('habit')) {
    type = 'habit';
    title = title.replace(/הרגל[:\s]*/i, '').replace(/habit[:\s]*/i, '');
  }

  // Detect time (e.g., "at 18:00", "ב-18:00")
  const timeMatch = text.match(/(?:at|ב-?|בשעה\s*)(\d{1,2}):?(\d{2})?/i);
  if (timeMatch) {
    const hours = timeMatch[1].padStart(2, '0');
    const minutes = (timeMatch[2] || '00').padStart(2, '0');
    dueTime = `${hours}:${minutes}`;
    title = title.replace(timeMatch[0], '').trim();
  }

  // Detect date keywords
  const today = new Date();
  if (text.includes('היום') || text.includes('today')) {
    dueDate = today.toISOString().split('T')[0];
    title = title.replace(/היום|today/i, '').trim();
  } else if (text.includes('מחר') || text.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDate = tomorrow.toISOString().split('T')[0];
    title = title.replace(/מחר|tomorrow/i, '').trim();
  }

  // Detect priority
  if (text.includes('דחוף') || text.includes('urgent') || text.includes('חשוב')) {
    priority = 'high';
    title = title.replace(/דחוף|urgent|חשוב/i, '').trim();
  }

  // Clean up title
  title = title.replace(/\s+/g, ' ').trim();

  return { type, title, dueDate, dueTime, priority };
}

const typeConfig = {
  task: { icon: CheckSquare, label: 'משימה', color: 'text-blue-400', gradient: 'from-blue-500 to-indigo-500' },
  habit: { icon: Repeat, label: 'הרגל', color: 'text-orange-400', gradient: 'from-orange-500 to-amber-500' },
  note: { icon: FileText, label: 'פתק', color: 'text-cyan-400', gradient: 'from-cyan-500 to-teal-500' },
  idea: { icon: Lightbulb, label: 'רעיון', color: 'text-amber-400', gradient: 'from-amber-500 to-yellow-500' },
  learning: { icon: Brain, label: 'למידה', color: 'text-purple-400', gradient: 'from-purple-500 to-violet-500' },
  journal: { icon: FileText, label: 'יומן', color: 'text-emerald-400', gradient: 'from-emerald-500 to-green-500' },
  link: { icon: FileText, label: 'קישור', color: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-500' },
};

export function BrainDumpInput() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [preview, setPreview] = useState<ReturnType<typeof parseInput> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useItemsStore();

  // Live preview of parsed input
  useEffect(() => {
    if (input.trim()) {
      setPreview(parseInput(input));
    } else {
      setPreview(null);
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);

    try {
      const parsed = parseInput(input);

      await addItem({
        type: parsed.type,
        title: parsed.title,
        dueDate: parsed.dueDate,
        dueTime: parsed.dueTime,
        priority: parsed.priority,
        isCompleted: false,
      } as any);

      const config = typeConfig[parsed.type];
      toast.success(`✨ ${config.label} נוצר/ה בהצלחה!`);
      setInput('');
      setPreview(null);
    } catch (error) {
      toast.error('שגיאה ביצירת הפריט');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Main Input Container */}
      <div
        className={cn(
          'relative rounded-2xl transition-all duration-300 overflow-hidden',
          isFocused
            ? 'ring-2 ring-[#3B82F6]/50 shadow-lg shadow-blue-500/10'
            : 'ring-1 ring-white/[0.08] hover:ring-white/[0.15]'
        )}
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-xl" />

        {/* Animated gradient border effect when focused */}
        {isFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent" />
          </motion.div>
        )}

        <div className="relative flex items-center gap-4 px-5 py-4">
          {/* AI Icon */}
          <motion.div
            animate={isFocused ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className={cn(
              'p-2.5 rounded-xl transition-all',
              isFocused
                ? 'bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] shadow-lg shadow-blue-500/25'
                : 'bg-white/[0.05]'
            )}
          >
            <Wand2 className={cn(
              'w-5 h-5 transition-colors',
              isFocused ? 'text-white' : 'text-[#64748b]'
            )} />
          </motion.div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder='הקלד משהו... AI יזהה את הסוג, התאריך והדחיפות'
            className="flex-1 bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-base"
            disabled={isProcessing}
          />

          {/* Submit Button */}
          <AnimatePresence mode="wait">
            {input.trim() && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={isProcessing}
                className="p-3 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Live Preview Panel */}
      <AnimatePresence>
        {preview && input.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-3 p-4 rounded-xl bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-xl border border-white/[0.08]"
          >
            <div className="flex items-center gap-2 mb-3 text-xs text-[#64748b]">
              <Sparkles className="w-3 h-3 text-[#3B82F6]" />
              <span>AI זיהה:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Type Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r text-white text-xs font-medium',
                  typeConfig[preview.type].gradient
                )}
              >
                {(() => {
                  const Icon = typeConfig[preview.type].icon;
                  return <Icon className="w-3.5 h-3.5" />;
                })()}
                {typeConfig[preview.type].label}
              </motion.div>

              {/* Date Badge */}
              {preview.dueDate && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {preview.dueDate === new Date().toISOString().split('T')[0] ? 'היום' : 'מחר'}
                </motion.div>
              )}

              {/* Time Badge */}
              {preview.dueTime && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-medium"
                >
                  <Clock className="w-3.5 h-3.5" />
                  {preview.dueTime}
                </motion.div>
              )}

              {/* Priority Badge */}
              {preview.priority === 'high' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  דחוף
                </motion.div>
              )}
            </div>

            {/* Title Preview */}
            <div className="mt-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <p className="text-sm text-[#f8fafc]">{preview.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints Panel */}
      <AnimatePresence>
        {isFocused && !input && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-3 p-4 rounded-xl bg-gradient-to-br from-[#0c0c12]/95 to-[#0a0a10]/95 backdrop-blur-xl border border-white/[0.08]"
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-[#f8fafc]">טיפים חכמים</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Clock, text: 'הוסף שעה: "פגישה ב-14:00"', color: 'text-cyan-400' },
                { icon: Calendar, text: 'הוסף תאריך: "מחר", "היום"', color: 'text-purple-400' },
                { icon: AlertTriangle, text: 'ציין דחיפות: "דחוף"', color: 'text-red-400' },
                { icon: Lightbulb, text: 'סוג: "רעיון:", "פתק:", "הרגל:"', color: 'text-amber-400' },
              ].map((hint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]"
                >
                  <hint.icon className={cn('w-3.5 h-3.5', hint.color)} />
                  <span className="text-xs text-[#94a3b8]">{hint.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
