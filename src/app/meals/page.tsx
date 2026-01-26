"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Save, Utensils } from "lucide-react";
import { useStore } from "@/store";

export default function MealsPage() {
    const { meals, setMeal } = useStore();
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [isEditing, setIsEditing] = useState(false);

    const currentMenu = meals[date] || "";
    const [editMenu, setEditMenu] = useState(currentMenu);

    const handleSave = () => {
        setMeal(date, editMenu);
        setIsEditing(false);
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setEditMenu(currentMenu);
            setIsEditing(true);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 font-sans">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">🍱 맛있는 급식</h1>
                <button
                    onClick={toggleEdit}
                    className={`p-2 rounded-full ${isEditing ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    {isEditing ? <Save className="w-6 h-6" /> : <Edit2 className="w-6 h-6" />}
                </button>
            </header>

            <main className="max-w-md mx-auto p-6 flex flex-col items-center">

                <div className="w-full mb-8">
                    <label className="block text-gray-500 font-bold mb-2 ml-1">날짜 선택</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl shadow-sm text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                </div>

                <div className="w-full bg-white rounded-[2rem] shadow-xl p-8 min-h-[400px] border-4 border-orange-100 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-4 rounded-full shadow-lg">
                        <Utensils className="w-8 h-8" />
                    </div>

                    <div className="mt-8 h-full">
                        {isEditing ? (
                            <textarea
                                value={editMenu}
                                onChange={(e) => setEditMenu(e.target.value)}
                                placeholder="오늘의 메뉴를 입력해주세요.&#13;&#10;(예: 현미밥, 미역국, 불고기, 김치)"
                                className="w-full h-[300px] p-4 bg-orange-50 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-300 text-lg leading-relaxed"
                                autoFocus
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center text-center">
                                {currentMenu ? (
                                    <div className="text-xl font-medium text-gray-700 leading-loose whitespace-pre-wrap">
                                        {currentMenu}
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col justify-center items-center text-gray-400 gap-4 mt-10">
                                        <p>등록된 급식 메뉴가 없어요 😢</p>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="bg-orange-100 text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-200 transition-colors"
                                        >
                                            메뉴 입력하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

            </main>
        </div>
    );
}
