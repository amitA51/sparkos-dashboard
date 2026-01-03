import { create } from 'zustand';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, CURRENT_USER_ID, COLLECTIONS } from '../firebase';
import type { PersonalItem, ItemType, Priority } from '../types';

interface ItemsState {
  items: PersonalItem[];
  isLoading: boolean;
  error: string | null;

  // Subscriptions
  subscribe: () => () => void;

  // CRUD Operations (Optimistic)
  addItem: (item: Omit<PersonalItem, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<PersonalItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  completeItem: (id: string) => Promise<void>;

  // Getters
  getItemsByType: (type: ItemType) => PersonalItem[];
  getActiveTasks: () => PersonalItem[];
  getOverdueTasks: () => PersonalItem[];
  getTodaysTasks: () => PersonalItem[];
  getActiveHabits: () => PersonalItem[];
}

export const useItemsStore = create<ItemsState>((set, get) => ({
  items: [],
  isLoading: true,
  error: null,

  subscribe: () => {
    const collectionPath = COLLECTIONS.personalItems(CURRENT_USER_ID);
    const q = query(
      collection(db, collectionPath),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PersonalItem[];

        set({ items, isLoading: false, error: null });
        console.log('🔥 SparkOS: Loaded', items.length, 'items from Firebase');
      },
      (error) => {
        console.error('Firebase error:', error);
        set({ error: error.message, isLoading: false });
      }
    );

    return unsubscribe;
  },

  addItem: async (item) => {
    const newItem = {
      ...item,
      createdAt: new Date().toISOString(),
      userId: CURRENT_USER_ID,
    };

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    set(state => ({
      items: [{ ...newItem, id: tempId } as PersonalItem, ...state.items]
    }));

    try {
      const collectionPath = COLLECTIONS.personalItems(CURRENT_USER_ID);
      await addDoc(collection(db, collectionPath), newItem);
    } catch (error) {
      // Rollback on error
      set(state => ({
        items: state.items.filter(i => i.id !== tempId),
        error: 'Failed to add item'
      }));
    }
  },

  updateItem: async (id, updates) => {
    const originalItems = get().items;

    // Optimistic update
    set(state => ({
      items: state.items.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() } as PersonalItem
          : item
      )
    }));

    try {
      const collectionPath = COLLECTIONS.personalItems(CURRENT_USER_ID);
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      // Rollback
      set({ items: originalItems, error: 'Failed to update item' });
    }
  },

  deleteItem: async (id) => {
    const originalItems = get().items;

    // Optimistic delete
    set(state => ({
      items: state.items.filter(item => item.id !== id)
    }));

    try {
      const collectionPath = COLLECTIONS.personalItems(CURRENT_USER_ID);
      await deleteDoc(doc(db, collectionPath, id));
    } catch (error) {
      // Rollback
      set({ items: originalItems, error: 'Failed to delete item' });
    }
  },

  completeItem: async (id) => {
    const item = get().items.find(i => i.id === id);
    if (!item) return;

    const isCompleted = 'isCompleted' in item ? !item.isCompleted : true;

    await get().updateItem(id, {
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined
    } as Partial<PersonalItem>);
  },

  // Getters
  getItemsByType: (type) => {
    return get().items.filter(item => item.type === type);
  },

  getActiveTasks: () => {
    return get().items.filter(
      item => item.type === 'task' && !('isCompleted' in item && item.isCompleted)
    );
  },

  getOverdueTasks: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().items.filter(item => {
      if (item.type !== 'task') return false;
      const task = item as PersonalItem & { dueDate?: string; isCompleted?: boolean };
      return task.dueDate && task.dueDate < today && !task.isCompleted;
    });
  },

  getTodaysTasks: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().items.filter(item => {
      if (item.type !== 'task') return false;
      const task = item as PersonalItem & { dueDate?: string };
      return task.dueDate?.startsWith(today);
    });
  },

  getActiveHabits: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().items.filter(item => {
      if (item.type !== 'habit') return false;
      const habit = item as PersonalItem & { lastCompletedDate?: string };
      return habit.lastCompletedDate !== today;
    });
  },
}));
