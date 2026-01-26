import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Book {
  id: number;
  title: string;
  rating: number;
  memo: string;
  date: string;
}

export interface DictationStats {
  total: number;
  correct: number;
}

export interface GugudanStats {
  total: number;
  correct: number;
}

interface StudyState {
  books: Book[];
  words: string[];
  dictationStats: DictationStats;
  gugudanStats: GugudanStats;

  // Actions
  addBook: (title: string, rating: number, memo: string) => void;
  
  addWord: (word: string) => void;
  removeWord: (word: string) => void;
  
  updateDictationStats: (correct: boolean) => void;
  updateGugudanStats: (correct: boolean) => void;
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set) => ({
      books: [],
      words: [],
      dictationStats: { total: 0, correct: 0 },
      gugudanStats: { total: 0, correct: 0 },

      addBook: (title, rating, memo) => set((state) => ({
        books: [...state.books, { 
          id: Date.now(), 
          title, 
          rating, 
          memo, 
          date: new Date().toLocaleDateString('ko-KR') 
        }]
      })),

      addWord: (word) => set((state) => ({
        words: [...state.words, word]
      })),

      removeWord: (word) => set((state) => ({
        words: state.words.filter((w) => w !== word)
      })),

      updateDictationStats: (correct) => set((state) => ({
        dictationStats: {
          total: state.dictationStats.total + 1,
          correct: state.dictationStats.correct + (correct ? 1 : 0)
        }
      })),

      updateGugudanStats: (correct) => set((state) => ({
        gugudanStats: {
          total: state.gugudanStats.total + 1,
          correct: state.gugudanStats.correct + (correct ? 1 : 0)
        }
      })),
    }),
    {
      name: 'study-storage',
    }
  )
);
