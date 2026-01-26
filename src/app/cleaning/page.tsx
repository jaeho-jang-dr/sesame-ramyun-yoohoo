"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, CheckCircle, Trash2, Sparkles } from "lucide-react";
import { useStore } from "@/store";
import confetti from "canvas-confetti";

export default function CleaningPage() {
    const { cleaningTasks, addCleaningTask, toggleCleaningTask } = useStore();
    const [taskName, setTaskName] = useState("");

    const handleAddTask = () => {
        if (!taskName) return;
        addCleaningTask({
            id: Date.now(),
            task: taskName,
            done: false,
            date: new Date().toLocaleDateString('ko-KR')
        });
        setTaskName("");
    };

    const handleToggle = (id: number, currentDone: boolean) => {
        toggleCleaningTask(id);
        if (!currentDone) {
            confetti({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.6 },
                colors: ['#10B981', '#34D399'] // Green shades
            });
        }
    };

    return (
        <div className="min-h-screen bg-teal-50 font-sans">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">🧹 청소와 심부름</h1>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">

                {/* Input */}
                <div className="bg-white p-5 rounded-2xl shadow-md border-2 border-teal-100">
                    <h2 className="text-lg font-bold text-teal-700 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        무엇을 도와드릴까요?
                    </h2>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                            placeholder="예: 신발 정리하기"
                            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                        <button
                            onClick={handleAddTask}
                            className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-600 transition-colors"
                        >
                            <Plus />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-500 pl-2">해야 할 일</h3>
                    {cleaningTasks.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <p>오늘은 쉴까요? 😊</p>
                        </div>
                    ) : (
                        cleaningTasks.map((task) => (
                            <div
                                key={task.id}
                                className={`flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer ${task.done
                                        ? "bg-gray-100 text-gray-400"
                                        : "bg-white shadow-md border-l-4 border-teal-400 hover:scale-[1.02]"
                                    }`}
                                onClick={() => handleToggle(task.id, task.done)}
                            >
                                <div className={`mt-1 rounded-full p-1 transition-colors ${task.done ? "text-teal-600" : "text-gray-300"
                                    }`}>
                                    <CheckCircle className={`w-7 h-7 ${task.done ? "fill-current" : ""}`} />
                                </div>

                                <div className="flex-1">
                                    <p className={`text-lg font-bold ${task.done ? "line-through" : "text-gray-800"}`}>
                                        {task.task}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
