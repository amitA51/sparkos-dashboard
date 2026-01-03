'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Lightbulb, Trash2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import type { IdeaItem } from '@/lib/types';

export default function IdeasPage() {
  const { items, deleteItem, addItem } = useItemsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaContent, setNewIdeaContent] = useState('');

  const ideas = items.filter(item => item.type === 'idea') as IdeaItem[];

  const handleAddIdea = async () => {
    if (!newIdeaTitle.trim()) return;

    await addItem({
      type: 'idea',
      title: newIdeaTitle,
      content: newIdeaContent,
      status: 'raw',
    } as any);

    setNewIdeaTitle('');
    setNewIdeaContent('');
    setShowAddForm(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc] flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-[#f59e0b]" />
            רעיונות
          </h1>
          <p className="text-[#94a3b8] mt-1">{ideas.length} רעיונות</p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          רעיון חדש
        </Button>
      </div>

      {/* Add Idea Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card variant="glow">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#f59e0b]" />
                  <input
                    type="text"
                    value={newIdeaTitle}
                    onChange={(e) => setNewIdeaTitle(e.target.value)}
                    placeholder="מה הרעיון שלך?"
                    autoFocus
                    className="flex-1 bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-xl font-semibold"
                  />
                </div>
                <textarea
                  value={newIdeaContent}
                  onChange={(e) => setNewIdeaContent(e.target.value)}
                  placeholder="פרט את הרעיון..."
                  rows={4}
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddIdea} size="sm">
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

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {ideas.map((idea) => (
            <motion.div
              key={idea.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="h-full group bg-gradient-to-br from-[#0d0d14] to-[#1a1a25]">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-[#f59e0b]/10">
                    <Lightbulb className="w-5 h-5 text-[#f59e0b]" />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteItem(idea.id)}
                    className="p-2 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                <h3 className="text-lg font-semibold text-[#f8fafc] mb-2 line-clamp-2">
                  {idea.title}
                </h3>
                {idea.content && (
                  <p className="text-[#94a3b8] text-sm line-clamp-3">
                    {idea.content}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-[#1e293b]">
                  <Badge variant="warning" size="sm">
                    {idea.status === 'raw' ? 'גולמי' : idea.status === 'developing' ? 'בפיתוח' : 'מוכן'}
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {ideas.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
            <Lightbulb className="w-10 h-10 text-[#f59e0b]" />
          </div>
          <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">אין רעיונות</h3>
          <p className="text-[#94a3b8] mb-4">שמור את הרעיונות שלך כאן</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-5 h-5" />
            רעיון חדש
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
