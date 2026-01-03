'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Link as LinkIcon, Trash2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useItemsStore } from '@/lib/stores/itemsStore';
import type { LinkItem } from '@/lib/types';

export default function LinksPage() {
  const { items, deleteItem, addItem } = useItemsStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const links = items.filter(item => item.type === 'link') as LinkItem[];

  const handleAddLink = async () => {
    if (!newLinkUrl.trim()) return;

    await addItem({
      type: 'link',
      title: newLinkTitle || newLinkUrl,
      url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`,
    } as any);

    setNewLinkTitle('');
    setNewLinkUrl('');
    setShowAddForm(false);
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#f8fafc] flex items-center gap-3">
            <LinkIcon className="w-8 h-8 text-[#06b6d4]" />
            קישורים
          </h1>
          <p className="text-[#94a3b8] mt-1">{links.length} קישורים שמורים</p>
        </div>

        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-5 h-5" />
          קישור חדש
        </Button>
      </div>

      {/* Add Link Form */}
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
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  autoFocus
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none text-lg"
                />
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                  placeholder="כותרת (אופציונלי)..."
                  className="w-full bg-transparent text-[#f8fafc] placeholder-[#64748b] outline-none"
                />
                <div className="flex items-center gap-2">
                  <Button onClick={handleAddLink} size="sm">
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

      {/* Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {links.map((link) => (
            <motion.div
              key={link.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="group h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-[#06b6d4]/10">
                    <LinkIcon className="w-5 h-5 text-[#06b6d4]" />
                  </div>
                  <div className="flex items-center gap-1">
                    <motion.a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg text-[#64748b] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => deleteItem(link.id)}
                      className="p-2 rounded-lg text-[#64748b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h3 className="text-lg font-semibold text-[#f8fafc] mb-1 line-clamp-2 hover:text-[#3B82F6] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-sm text-[#64748b]">
                    {getDomain(link.url)}
                  </p>
                </a>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {links.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#06b6d4]/10 flex items-center justify-center">
            <LinkIcon className="w-10 h-10 text-[#06b6d4]" />
          </div>
          <h3 className="text-xl font-semibold text-[#f8fafc] mb-2">אין קישורים</h3>
          <p className="text-[#94a3b8] mb-4">שמור קישורים חשובים כאן</p>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-5 h-5" />
            קישור חדש
          </Button>
        </motion.div>
      )}
    </DashboardLayout>
  );
}
