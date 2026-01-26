import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Timetable, Notice, Book, Word, MoneyTransaction, CleaningTask, Meal, SavingsGoal } from '../types';

interface AppState {
    // 시간표
    timetable: Timetable;
    setTimetable: (data: Timetable) => void;
    updateDayTimetable: (day: string, items: any[]) => void;

    // 알림장
    notices: Notice[];
    addNotice: (notice: Notice) => void;
    toggleNotice: (id: number) => void;
    removeNotice: (id: number) => void;

    // 독서
    books: Book[];
    addBook: (book: Book) => void;

    // 받아쓰기
    words: Word[];
    addWord: (text: string) => void;

    // 구구단 점수
    gugudanStats: { total: number; correct: number; highScore: number };
    updateGugudanStats: (isCorrect: boolean, score: number) => void;

    // 용돈
    money: MoneyTransaction[];
    savingsGoal: SavingsGoal | null;
    addMoneyTransaction: (transaction: MoneyTransaction) => void;
    setSavingsGoal: (goal: SavingsGoal | null) => void;

    // 급식
    meals: Record<string, string>; // date string key
    setMeal: (date: string, menu: string) => void;

    // 청소
    cleaningTasks: CleaningTask[];
    addCleaningTask: (task: CleaningTask) => void;
    toggleCleaningTask: (id: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            // Init Data
            timetable: {
                '월요일': [], '화요일': [], '수요일': [], '목요일': [], '금요일': []
            },
            notices: [],
            books: [],
            words: [],
            gugudanStats: { total: 0, correct: 0, highScore: 0 },
            money: [],
            savingsGoal: null,
            meals: {},
            cleaningTasks: [],

            // Actions
            setTimetable: (data) => set({ timetable: data }),
            updateDayTimetable: (day, items) => set((state) => ({
                timetable: { ...state.timetable, [day]: items }
            })),

            addNotice: (notice) => set((state) => ({ notices: [...state.notices, notice] })),
            toggleNotice: (id) => set((state) => ({
                notices: state.notices.map((n) => n.id === id ? { ...n, done: !n.done } : n)
            })),
            removeNotice: (id) => set((state) => ({
                notices: state.notices.filter((n) => n.id !== id)
            })),

            addBook: (book) => set((state) => ({ books: [...state.books, book] })),

            addWord: (text) => set((state) => ({
                words: [...state.words, { id: Date.now().toString(), text, isMemorized: false }]
            })),

            updateGugudanStats: (isCorrect, currentScore) => set((state) => ({
                gugudanStats: {
                    total: state.gugudanStats.total + 1,
                    correct: state.gugudanStats.correct + (isCorrect ? 1 : 0),
                    highScore: Math.max(state.gugudanStats.highScore, currentScore)
                }
            })),

            addMoneyTransaction: (transaction) => set((state) => ({
                money: [...state.money, transaction]
            })),

            setSavingsGoal: (goal) => set({ savingsGoal: goal }),

            setMeal: (date, menu) => set((state) => ({
                meals: { ...state.meals, [date]: menu }
            })),

            addCleaningTask: (task) => set((state) => ({
                cleaningTasks: [...state.cleaningTasks, task]
            })),
            toggleCleaningTask: (id) => set((state) => ({
                cleaningTasks: state.cleaningTasks.map((t) => t.id === id ? { ...t, done: !t.done } : t)
            }))
        }),
        {
            name: 'sesame-storage', // local storage key
            storage: createJSONStorage(() => localStorage),
        }
    )
);
