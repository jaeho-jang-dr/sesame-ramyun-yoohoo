"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, CheckCircle, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useStore } from "@/store";
import confetti from "canvas-confetti";

export default function NoticesPage() {
    const { notices, addNotice, toggleNotice, removeNotice } = useStore();
    const [text, setText] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

    const handleAddStart = () => {
        if (!text) return;
        addNotice({
            id: Date.now(),
            text,
            date,
            done: false,
        });
        setText("");
        // Keep date as is or reset? Keep as today/selected.
    };

    const handleToggle = (id: number, currentDone: boolean) => {
        toggleNotice(id);
        if (!currentDone) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const sortedNotices = [...notices].sort((a, b) => {
        // Sort by done (incomplete first), then date (newest first)
        if (a.done === b.done) {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.done ? 1 : -1;
    });

    return (
        <div className="min-h-screen bg-green-50 font-sans">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">📝 알림장</h1>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Input Card */}
                <div className="bg-white p-5 rounded-2xl shadow-md border-2 border-green-100">
                    <h2 className="text-lg font-bold text-green-700 mb-3">새로운 알림</h2>
                    <div className="space-y-3">
                        <div className="relative">
                            <CalendarIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>
                        <textarea
                            placeholder="숙제 내용이나 준비물을 적어주세요!"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none h-24"
                        />
                        <button
                            onClick={handleAddStart}
                            disabled={!text}
                            className="w-full py-3 bg-green-500 text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 hover:bg-green-600 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            알림장 쓰기
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-500 pl-2">알림 목록 ({notices.filter(n => !n.done).length}개 남음)</h3>
                    {sortedNotices.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>아직 알림장이 없어요!</p>
                        </div>
                    ) : (
                        sortedNotices.map((notice) => (
                            <div
                                key={notice.id}
                                className={`flex items-start gap-3 p-4 rounded-2xl transition-all ${notice.done
                                        ? "bg-gray-100 text-gray-400"
                                        : "bg-white shadow-md border-l-4 border-green-400"
                                    }`}
                            >
                                <button
                                    onClick={() => handleToggle(notice.id, notice.done)}
                                    className={`mt-1 rounded-full p-1 transition-colors ${notice.done ? "text-green-600" : "text-gray-300 hover:text-green-400"
                                        }`}
                                >
                                    <CheckCircle className={`w-7 h-7 ${notice.done ? "fill-current" : ""}`} />
                                </button>

                                <div className="flex-1">
                                    <p className={`text-lg font-bold ${notice.done ? "line-through" : "text-gray-800"}`}>
                                        {notice.text}
                                    </p>
                                    <p className="text-sm mt-1 opacity-80">{notice.date}</p>
                                </div>

                                <button
                                    onClick={() => removeNotice(notice.id)}
                                    className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
