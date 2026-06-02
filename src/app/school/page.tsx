"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import { SchoolTimetable } from "@/components/school/SchoolTimetable";
import { DailyPlanner } from "@/components/school/DailyPlanner";

export default function TimetablePage() {
    const [activeTab, setActiveTab] = useState<'timetble' | 'planner'>('timetble');

    return (
        <div className="min-h-screen bg-[#FFF7ED]">
            {/* Header */}
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
                    <button
                        onClick={() => setActiveTab('timetble')}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                            activeTab === 'timetble' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            학교 시간표
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('planner')}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                            activeTab === 'planner' 
                            ? 'bg-white text-purple-600 shadow-sm' 
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            생활 계획표
                        </span>
                    </button>
                </div>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </header>

            <main className="max-w-4xl mx-auto p-4 py-8">
                {activeTab === 'timetble' ? (
                    <SchoolTimetable />
                ) : (
                    <DailyPlanner />
                )}
            </main>
        </div>
    );
}
