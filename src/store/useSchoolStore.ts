import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TimetableItem {
  subject: string;
  items: string;
}

export interface Notice {
  id: number;
  text: string;
  date: string;
  done: boolean;
}

export interface Meal {
  date: string; // YYYY-MM-DD
  menu: string;
}

interface SchoolState {
  timetable: Record<string, TimetableItem[]>; // Key: "월요일", "화요일", etc.
  notices: Notice[];
  meals: Record<string, string>; // Key: date, Value: menu

  // Actions
  addSubject: (day: string, subject: string, items: string) => void;
  removeSubject: (day: string, index: number) => void;
  
  addNotice: (text: string, date: string) => void;
  toggleNotice: (id: number) => void;
  removeNotice: (id: number) => void;

  addMeal: (date: string, menu: string) => void;
}

export const useSchoolStore = create<SchoolState>()(
  persist(
    (set) => ({
      timetable: {
        '월요일': [], '화요일': [], '수요일': [], '목요일': [], '금요일': []
      },
      notices: [],
      meals: {},

      addSubject: (day, subject, items) => set((state) => ({
        timetable: {
          ...state.timetable,
          [day]: [...(state.timetable[day] || []), { subject, items }]
        }
      })),

      removeSubject: (day, index) => set((state) => ({
        timetable: {
          ...state.timetable,
          [day]: state.timetable[day].filter((_, i) => i !== index)
        }
      })),

      addNotice: (text, date) => set((state) => ({
        notices: [...state.notices, { id: Date.now(), text, date, done: false }]
      })),

      toggleNotice: (id) => set((state) => ({
        notices: state.notices.map((n) => n.id === id ? { ...n, done: !n.done } : n)
      })),

      removeNotice: (id) => set((state) => ({
        notices: state.notices.filter((n) => n.id !== id)
      })),

      addMeal: (date, menu) => set((state) => ({
        meals: { ...state.meals, [date]: menu }
      })),
    }),
    {
      name: 'school-storage',
    }
  )
);
