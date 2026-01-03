// ═══════════════════════════════════════════════════════════
// SparkOS Type Definitions
// ═══════════════════════════════════════════════════════════

export type ItemType =
  | 'task'
  | 'habit'
  | 'note'
  | 'idea'
  | 'learning'
  | 'journal'
  | 'link';

export type Priority = 'low' | 'medium' | 'high';

export interface BaseItem {
  id: string;
  type: ItemType;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}

export interface TaskItem extends BaseItem {
  type: 'task';
  dueDate?: string;
  dueTime?: string;
  priority?: Priority;
  isCompleted: boolean;
  completedAt?: string;
}

export interface HabitItem extends BaseItem {
  type: 'habit';
  isCompleted: boolean;
  streak?: number;
  lastCompletedDate?: string;
  frequency?: 'daily' | 'weekly' | 'custom';
}

export interface NoteItem extends BaseItem {
  type: 'note';
  tags?: string[];
}

export interface IdeaItem extends BaseItem {
  type: 'idea';
  status?: 'raw' | 'developing' | 'ready';
}

export interface LearningItem extends BaseItem {
  type: 'learning';
  source?: string;
  category?: string;
}

export interface JournalItem extends BaseItem {
  type: 'journal';
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  date: string;
}

export interface LinkItem extends BaseItem {
  type: 'link';
  url: string;
  favicon?: string;
}

export type PersonalItem =
  | TaskItem
  | HabitItem
  | NoteItem
  | IdeaItem
  | LearningItem
  | JournalItem
  | LinkItem;

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  focusMode: boolean;
  focusedItemId: string | null;
  commandPaletteOpen: boolean;
  selectedDate: string;
  activeSection: string;
}

// Stats Types
export interface DailyStats {
  tasksCompleted: number;
  tasksTotal: number;
  habitsCompleted: number;
  habitsTotal: number;
  score: number;
}

// Time of Day
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// Greeting Data
export interface GreetingData {
  name: string;
  timeOfDay: TimeOfDay;
  date: string;
  dayOfWeek: string;
}
