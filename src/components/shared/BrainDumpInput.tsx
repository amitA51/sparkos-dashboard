'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useItemsStore } from '@/lib/stores/itemsStore';
import toast from 'react-hot-toast';
import type { ItemType, Priority } from '@/lib/types';

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

export function BrainDumpInput() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useItemsStore();

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

      const typeLabels: Record<ItemType, string> = {
        task: 'משימה',
        habit: 'הרגל',
        note: 'פתק',
        idea: 'רעיון',
        learning: 'למידה',
        journal: 'יומן',
        link: 'קישור'
      };

      toast.success(`✨ ${typeLabels[parsed.type]} נוצר/ה!`);
      setInput('');
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
      className="relative mb-6"
    >
      <div
        className={`
          relative flex items-center gap-3 px-4 py-3 rounded-2xl
          bg-[#0d0d14] border transition-all duration-300
          ${isFocused
            ? 'border-[#3B82F6] glow-blue'
            : 'border-[#1e293b] hover:border-[#3B82F6]/50'
          }
        `}
      >
        <Sparkles className={`w-5 h-5 transition-colors ${isFocused ? 'text-[#3B82F6]' : 'text-[#64748b]'}`} />

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder='הקלד משהו... (למשל: "ספורט מחר ב-18:00")'
          className="flex-1 bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none"
          disabled={isProcessing}
        />

        <AnimatePresence mode="wait">
          {input.trim() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleSubmit}
              disabled={isProcessing}
              className="p-2 rounded-lg bg-[#3B82F6] text-white hover:bg-[#2563eb] transition-colors disabled:opacity-50"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Hints */}
      <AnimatePresence>
        {isFocused && !input && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full mt-2 right-0 left-0 p-3 rounded-xl bg-[#0d0d14] border border-[#1e293b] text-xs text-[#94a3b8]"
          >
            <p className="mb-2 font-medium text-[#f8fafc]">טיפים:</p>
            <ul className="space-y-1 text-right">
              <li>• הוסף שעה: "פגישה ב-14:00"</li>
              <li>• הוסף תאריך: "מחר", "היום"</li>
              <li>• ציין דחיפות: "דחוף"</li>
              <li>• סוג: "רעיון:", "פתק:", "הרגל:"</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
