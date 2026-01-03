'use client';

import { motion } from 'framer-motion';
import { Settings, User, Bell, Palette, Database, Shield } from 'lucide-react';
import { DashboardLayout } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { CURRENT_USER_ID } from '@/lib/firebase';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#f8fafc] flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#94a3b8]" />
          הגדרות
        </h1>
        <p className="text-[#94a3b8] mt-1">נהל את ההעדפות שלך</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        {/* User Info */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#f8fafc]">עמית</h3>
              <p className="text-sm text-[#64748b]">User ID: {CURRENT_USER_ID.slice(0, 12)}...</p>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#8B5CF6]/10">
              <Palette className="w-6 h-6 text-[#8B5CF6]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#f8fafc]">מראה</h3>
              <p className="text-sm text-[#94a3b8] mt-1">ערכת נושא OLED Dark פעילה</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#050505] border-2 border-[#3B82F6]" />
                <div className="w-8 h-8 rounded-full bg-[#3B82F6]" />
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]" />
                <div className="w-8 h-8 rounded-full bg-[#22c55e]" />
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#f59e0b]/10">
              <Bell className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#f8fafc]">התראות</h3>
              <p className="text-sm text-[#94a3b8] mt-1">קבל תזכורות על משימות והרגלים</p>
              <div className="mt-4">
                <Button variant="secondary" size="sm">
                  הפעל התראות
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Data */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#22c55e]/10">
              <Database className="w-6 h-6 text-[#22c55e]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#f8fafc]">נתונים</h3>
              <p className="text-sm text-[#94a3b8] mt-1">מחובר ל-Firebase Firestore</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-sm text-[#22c55e]">מסונכרן</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-[#3B82F6]/10">
              <Shield className="w-6 h-6 text-[#3B82F6]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[#f8fafc]">פרטיות</h3>
              <p className="text-sm text-[#94a3b8] mt-1">הנתונים שלך מאובטחים ב-Firebase</p>
            </div>
          </div>
        </Card>

        {/* Version */}
        <div className="text-center py-8">
          <p className="text-[#64748b] text-sm">
            SparkOS Dashboard v1.0.0
          </p>
          <p className="text-[#64748b] text-xs mt-1">
            Built with ❤️ using Next.js, Tailwind & Firebase
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
