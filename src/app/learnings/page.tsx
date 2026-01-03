'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, GraduationCap, Trash2, BookOpen } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import type { LearningItem } from '@/lib/types';

export default function LearningsPage() {
  const { items, deleteItem, addItem } = useItemsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLearningTitle, setNewLearningTitle] = useState('');
  const [newLearningContent, setNewLearningContent] = useState('');

  const learnings = items.filter(item => item.type === 'learning') as LearningItem[];

  const handleAddLearning = async () => {
    if (!newLearningTitle.trim()) return;

    await addItem({
      type: 'learning',
      title: newLearningTitle,
      content: newLearningContent,
    } as any);

    setNewLearningTitle('');
    setNewLearningContent('');
    setShowAddForm(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc] flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#8B5CF6]" />
            למידה
          </h1>
          <p className="text-[#94a3b8] mt-1">{learnings.length} תובנות</p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          תובנה חדשה
        </Button>
      </div>

      {/* Add Learning Form */}
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
                  value={newLearningTitle}
                  onChange={(e) => setNewLearningTitle(e.target.value)}
                  placeholder="מה למדת היום?"
                  autoFocus
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-xl font-semibold"
                />
                <textarea
                  value={newLearningContent}
                  onChange={(e) => setNewLearningContent(e.target.value)}
                  placeholder="פרט את התובנה..."
                  rows={6}
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddLearning} size="sm">
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

      {/* Learnings List */}
      <div className="space-y-4">
        <AnimatePresence>
          {learnings.map((learning) => (
            <motion.div
              key={learning.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#8B5CF6]/10 flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">
                        {learning.title}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteItem(learning.id)}
                        className="p-2 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                    {learning.content && (
                      <p className="text-[#94a3b8] whitespace-pre-wrap leading-relaxed">
                        {learning.content}
                      </p>
                    )}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-xs text-[#64748b]">
                        {new Date(learning.createdAt).toLocaleDateString('he-IL')}
                      </span>
                      {learning.category && (
                        <Badge variant="purple" size="sm">
                          {learning.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {learnings.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-[#8B5CF6]" />
          </div>
          <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">אין תובנות</h3>
          <p className="text-[#94a3b8] mb-4">שמור את מה שלמדת כאן</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-5 h-5" />
            תובנה חדשה
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
