'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import type { NoteItem } from '@/lib/types';

export default function NotesPage() {
  const { items, deleteItem, addItem } = useItemsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const notes = items.filter(item => item.type === 'note') as NoteItem[];

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = async () => {
    if (!newNoteTitle.trim()) return;

    await addItem({
      type: 'note',
      title: newNoteTitle,
      content: newNoteContent,
    } as any);

    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddForm(false);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc] flex items-center gap-3">
            <FileText className="w-8 h-8 text-[#3B82F6]" />
            פתקים
          </h1>
          <p className="text-[#94a3b8] mt-1">{notes.length} פתקים</p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          פתק חדש
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="חפש בפתקים..."
          className="w-full pr-12 pl-4 py-3 bg-[#0d0d14] border border-[#1e293b] rounded-xl text-[#f8fafc] placeholder-[#64748b] outline-none focus:border-[#3B82F6] transition-colors"
        />
      </div>

      {/* Add Note Form */}
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
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="כותרת הפתק..."
                  autoFocus
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-xl font-semibold"
                />
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="תוכן הפתק..."
                  rows={4}
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none resize-none"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddNote} size="sm">
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

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="h-full group">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[#f8fafc] line-clamp-1">
                    {note.title}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteItem(note.id)}
                    className="p-2 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
                {note.content && (
                  <p className="text-[#94a3b8] text-sm line-clamp-4">
                    {note.content}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-[#1e293b]">
                  <span className="text-xs text-[#64748b]">
                    {new Date(note.createdAt).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1a1a25] flex items-center justify-center">
            <FileText className="w-10 h-10 text-[#64748b]" />
          </div>
          <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">
            {searchQuery ? 'לא נמצאו תוצאות' : 'אין פתקים'}
          </h3>
          <p className="text-[#94a3b8] mb-4">
            {searchQuery ? 'נסה לחפש משהו אחר' : 'הוסף פתק חדש כדי להתחיל'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-5 h-5" />
              פתק חדש
            </Button>
          )}
        </motion.div>
      )}
    </DashboardLayout>
  );
}
