import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MoneyTransaction {
  id: number;
  type: 'income' | 'expense'; // 'income' = 받음, 'expense' = 씀
  amount: number;
  memo: string;
  date: string;
}

export interface CleaningTask {
  id: number;
  task: string;
  date: string;
  done: boolean;
}

interface LifeState {
  money: MoneyTransaction[];
  cleaning: CleaningTask[];

  // Actions
  addTransaction: (type: 'income' | 'expense', amount: number, memo: string) => void;
  removeTransaction: (id: number) => void;

  addCleaningTask: (task: string, date: string) => void;
  toggleCleaningTask: (id: number) => void;
  removeCleaningTask: (id: number) => void;
}

export const useLifeStore = create<LifeState>()(
  persist(
    (set) => ({
      money: [],
      cleaning: [],

      addTransaction: (type, amount, memo) => set((state) => ({
        money: [...state.money, {
          id: Date.now(),
          type,
          amount,
          memo,
          date: new Date().toLocaleDateString('ko-KR')
        }]
      })),

      removeTransaction: (id) => set((state) => ({
        money: state.money.filter((m) => m.id !== id)
      })),

      addCleaningTask: (task, date) => set((state) => ({
        cleaning: [...state.cleaning, { id: Date.now(), task, date, done: false }]
      })),

      toggleCleaningTask: (id) => set((state) => ({
        cleaning: state.cleaning.map((c) => c.id === id ? { ...c, done: !c.done } : c)
      })),

      removeCleaningTask: (id) => set((state) => ({
        cleaning: state.cleaning.filter((c) => c.id !== id)
      })),
    }),
    {
      name: 'life-storage',
    }
  )
);
