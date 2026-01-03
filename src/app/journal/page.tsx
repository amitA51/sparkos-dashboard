'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Trash2, Smile, Meh, Frown } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import { cn } from '@/lib/utils/cn';
import type { JournalItem } from '@/lib/types';

const moods = [
  { value: 'great', label: 'מעולה', emoji: '😊', color: 'text-[#22c55e]' },
  { value: 'good', label: 'טוב', emoji: '🙂', color: 'text-[#3B82F6]' },
  { value: 'neutral', label: 'בסדר', emoji: '😐', color: 'text-[#94a3b8]' },
  { value: 'bad', label: 'לא טוב', emoji: '😔', color: 'text-[#f59e0b]' },
  { value: 'terrible', label: 'גרוע', emoji: '😢', color: 'text-[#ef4444]' },
] as const;

export default function JournalPage() {
  const { items, deleteItem, addItem } = useItemsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJournalTitle, setNewJournalTitle] = useState('');
  const [newJournalContent, setNewJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<typeof moods[number]['value']>('neutral');

  const journals = items.filter(item => item.type === 'journal') as JournalItem[];

  const handleAddJournal = async () => {
    if (!newJournalContent.trim()) return;

    const today = new Date().toISOString().split('T')[0];

    await addItem({
      type: 'journal',
      title: newJournalTitle || `יומן - ${new Date().toLocaleDateString('he-IL')}`,
      content: newJournalContent,
      mood: selectedMood,
      date: today,
    } as any);

    setNewJournalTitle('');
    setNewJournalContent('');
    setSelectedMood('neutral');
    setShowAddForm(false);
  };

  const getMoodInfo = (mood: string) => moods.find(m => m.value === mood) || moods[2];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc] flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#22c55e]" />
            יומן
          </h1>
          <p className="text-[#94a3b8] mt-1">{journals.length} רשומות</p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          רשומה חדשה
        </Button>
      </div>

      {/* Add Journal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newJournalTitle}
                  onChange={(e) => setNewJournalTitle(e.target.value)}
                  placeholder="כותרת (אופציונלי)..."
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-xl font-semibold"
                />

                {/* Mood Selector */}
                <div>
                  <p className="text-sm text-[#94a3b8] mb-2">איך אתה מרגיש?</p>
                  <div className="flex items-center gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={cn(
                          'px-4 py-2 rounded-xl text-2xl transition-all',
                          selectedMood === mood.value
                            ? 'bg-[#3B82F6]/20 ring-2 ring-[#3B82F6] scale-110'
                            : 'bg-[#12121a] hover:bg-[#1a1a25]'
                        )}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newJournalContent}
                  onChange={(e) => setNewJournalContent(e.target.value)}
                  placeholder="מה עובר עליך היום?"
                  rows={6}
                  autoFocus
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddJournal} size="sm">
                    שמור
                  </Button>
                  <Button onClick={() => setShowAddForm(false)} variant="ghost" size="sm">
                    ביטול
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Journal Entries */}
      <div className="space-y-4">
        <AnimatePresence>
          {journals.map((journal) => {
            const moodInfo = getMoodInfo(journal.mood || 'neutral');

            return (
              <motion.div
                key={journal.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Card className="group">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{moodInfo.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-[#f8fafc]">
                            {journal.title}
                          </h3>
                          <span className="text-sm text-[#64748b]">
                            {new Date(journal.createdAt).toLocaleDateString('he-IL', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteItem(journal.id)}
                          className="p-2 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                      {journal.content && (
                        <p className="text-[#94a3b8] mt-3 whitespace-pre-wrap leading-relaxed">
                          {journal.content}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {journals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#22c55e]/10 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-[#22c55e]" />
          </div>
          <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">אין רשומות ביומן</h3>
          <p className="text-[#94a3b8] mb-4">התחל לכתוב את המחשבות שלך</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-5 h-5" />
            רשומה חדשה
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
