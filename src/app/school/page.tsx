"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Edit2, Save } from "lucide-react";
import { useStore } from "@/store";

const DAYS = ["월요일", "화요일", "수요일", "목요일", "금요일"];

export default function TimetablePage() {
    const { timetable, updateDayTimetable } = useStore();
    const [activeDay, setActiveDay] = useState("월요일");
    const [isEditing, setIsEditing] = useState(false);

    // Local state for editing form
    const [newSubject, setNewSubject] = useState("");
    const [newItem, setNewItem] = useState("");

    const currentSchedule = timetable[activeDay] || [];

    const handleAddSubject = () => {
        if (!newSubject) return;
        const newEntry = { subject: newSubject, items: newItem };
        updateDayTimetable(activeDay, [...currentSchedule, newEntry]);
        setNewSubject("");
        setNewItem("");
    };

    const handleDeleteSubject = (index: number) => {
        const newSchedule = currentSchedule.filter((_, i) => i !== index);
        updateDayTimetable(activeDay, newSchedule);
    };

    return (
        <div className="min-h-screen bg-blue-50 font-sans">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">📅 학교 시간표</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`p-2 rounded-full ${isEditing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </button>
            </header>

            <main className="max-w-md mx-auto p-4">
                {/* Day Tabs */}
                <div className="flex justify-between mb-6 bg-white p-1 rounded-xl shadow-sm">
                    {DAYS.map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${activeDay === day
                                ? "bg-blue-500 text-white shadow-md"
                                : "text-gray-500 hover:bg-gray-100"
                                }`}
                        >
                            {day[0]}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[400px]">
                        <h2 className="text-2xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                            {activeDay} 수업
                            <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                                {currentSchedule.length}교시
                            </span>
                        </h2>

                        {currentSchedule.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-lg mb-2">수업이 없어요!</p>
                                <p className="text-sm">편집 버튼을 눌러 시간표를 추가해보세요.</p>
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {currentSchedule.map((item, idx) => (
                                    <li key={idx} className={`flex items-start gap-4 p-4 rounded-2xl transition-all border shadow-sm ${isEditing ? 'border-gray-200 bg-white' : 'border-transparent bg-white shadow-md'
                                        }`}>
                                        <div className={`text-white font-black w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${idx % 2 === 0 ? 'bg-blue-400' : 'bg-indigo-400'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xl font-bold text-gray-800">{item.subject}</p>
                                            {item.items ? (
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 font-medium bg-gray-100 w-fit px-2 py-1 rounded-lg">
                                                    🎒 {item.items}
                                                </p>
                                            ) : (
                                                <div className="h-6"></div>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => handleDeleteSubject(idx)}
                                                className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Add Form (only in edit mode) */}
                        {isEditing && (
                            <div className="mt-8 pt-6 border-t border-gray-100 animation-fade-in">
                                <h3 className="font-bold text-gray-700 mb-3">수업 추가하기</h3>
                                <div className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="과목 이름 (예: 국어)"
                                        value={newSubject}
                                        onChange={(e) => setNewSubject(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="준비물 (선택)"
                                        value={newItem}
                                        onChange={(e) => setNewItem(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                    <button
                                        onClick={handleAddSubject}
                                        disabled={!newSubject}
                                        className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        추가하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
