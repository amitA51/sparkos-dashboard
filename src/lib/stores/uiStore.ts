import { create } from 'zustand';
import type { UIState } from '../types';

interface UIStore extends UIState {
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleFocusMode: (itemId?: string) => void;
  setFocusMode: (active: boolean, itemId?: string) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setSelectedDate: (date: string) => void;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Initial State
  sidebarOpen: true,
  focusMode: false,
  focusedItemId: null,
  commandPaletteOpen: false,
  selectedDate: new Date().toISOString().split('T')[0],
  activeSection: 'dashboard',

  // Actions
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleFocusMode: (itemId) => set(state => ({
    focusMode: !state.focusMode,
    focusedItemId: state.focusMode ? null : (itemId || null)
  })),

  setFocusMode: (active, itemId) => set({
    focusMode: active,
    focusedItemId: active ? (itemId || null) : null
  }),

  toggleCommandPalette: () => set(state => ({
    commandPaletteOpen: !state.commandPaletteOpen
  })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  setSelectedDate: (date) => set({ selectedDate: date }),

  setActiveSection: (section) => set({ activeSection: section }),
}));
