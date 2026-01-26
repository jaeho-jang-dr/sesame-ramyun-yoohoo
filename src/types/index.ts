export interface TimetableItem {
    subject: string;
    items: string; // 준비물
}

export interface Timetable {
    [key: string]: TimetableItem[]; // '월요일', '화요일'...
}

export interface Notice {
    id: number;
    text: string;
    date: string;
    done: boolean;
}

export interface Book {
    id: number;
    title: string;
    rating: number;
    memo: string;
    date: string;
}

export interface Word {
    id: string;
    text: string;
    isMemorized: boolean;
}

export interface MoneyTransaction {
    id: number;
    type: 'income' | 'expense'; // 받음 | 씀
    amount: number;
    memo: string;
    date: string;
}

export interface CleaningTask {
    id: number;
    task: string;
    done: boolean;
    date: string;
}

export interface Meal {
    date: string;
    menu: string;
    rating?: number; // 급식 맛 점수
}

export interface SavingsGoal {
    name: string;
    targetAmount: number;
}
