"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search, MapPin, Utensils, RotateCcw } from "lucide-react";
import { getMeals, searchSchool, SchoolInfo, MealInfo } from "@/lib/neis";

export default function MealsPage() {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [school, setSchool] = useState<SchoolInfo | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SchoolInfo[]>([]);
    const [meal, setMeal] = useState<MealInfo | null>(null);
    const [loading, setLoading] = useState(false);

    // Load saved school on mount
    useEffect(() => {
        const saved = localStorage.getItem("mySchool");
        if (saved) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- loading persisted state on mount
            setSchool(JSON.parse(saved));
        }
    }, []);

    // Fetch meals when date or school changes
    useEffect(() => {
        if (school && date) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- start loading before async fetch
            setLoading(true);
            getMeals(school.ATPT_OFCDC_SC_CODE, school.SD_SCHUL_CODE, date)
                .then(data => setMeal(data))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [school, date]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setLoading(true);
        const results = await searchSchool(searchQuery);
        setSearchResults(results);
        setLoading(false);
    };

    const selectSchool = (s: SchoolInfo) => {
        setSchool(s);
        localStorage.setItem("mySchool", JSON.stringify(s));
        setSearchResults([]);
        setSearchQuery("");
    };

    const resetSchool = () => {
        if (confirm("학교 설정을 초기화할까요?")) {
            setSchool(null);
            localStorage.removeItem("mySchool");
            setMeal(null);
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 pb-20">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">🍱 맛있는 급식</h1>
                {school && (
                    <button onClick={resetSchool} className="p-2 text-gray-400 hover:text-red-500">
                        <RotateCcw className="w-5 h-5" />
                    </button>
                )}
            </header>

            <main className="max-w-md mx-auto p-6 flex flex-col items-center gap-6">

                {!school ? (
                    // School Selection Mode
                    <div className="w-full bg-white p-6 rounded-2xl shadow-lg border border-orange-100 text-center animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">우리 학교를 찾아주세요!</h2>
                        <p className="text-gray-500 text-sm mb-6">학교 이름을 검색하면 급식표를 가져올게요.</p>

                        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="예: 서울초등학교"
                                className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                            />
                            <button type="submit" className="bg-orange-500 text-white p-3 rounded-xl hover:bg-orange-600">
                                <Search className="w-5 h-5" />
                            </button>
                        </form>

                        <div className="space-y-2 max-h-60 overflow-y-auto text-left">
                            {searchResults.map((s) => (
                                <button
                                    key={s.SD_SCHUL_CODE}
                                    onClick={() => selectSchool(s)}
                                    className="w-full p-3 hover:bg-orange-50 rounded-lg flex items-center gap-2 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <MapPin className="w-4 h-4 text-orange-400" />
                                    <span className="font-bold text-gray-700">{s.SCHUL_NM}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Meal View Mode
                    <>
                        <div className="w-full flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 text-orange-600 font-bold">
                                <MapPin className="w-5 h-5" />
                                <span>{school.SCHUL_NM}</span>
                            </div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-2 font-bold text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                            />
                        </div>

                        <div className="w-full bg-white rounded-[2rem] shadow-xl p-8 min-h-[400px] border border-orange-100 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white p-4 rounded-full shadow-lg">
                                <Utensils className="w-8 h-8" />
                            </div>

                            <div className="mt-8 h-full flex flex-col items-center justify-center text-center">
                                {loading ? (
                                    <div className="animate-pulse space-y-4">
                                        <div className="h-4 bg-gray-200 rounded w-48 mx-auto"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
                                        <div className="h-4 bg-gray-200 rounded w-40 mx-auto"></div>
                                    </div>
                                ) : meal ? (
                                    <>
                                        <div className="text-xl font-medium text-gray-800 leading-loose whitespace-pre-wrap">
                                            {meal.DDISH_NM}
                                        </div>
                                        <div className="mt-8 pt-6 border-t border-dashed border-gray-200 w-full text-xs text-gray-400">
                                            <p>{meal.CAL_INFO}</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-gray-400 py-10">
                                        <p className="text-lg mb-2">급식 정보가 없어요 😢</p>
                                        <p className="text-sm">쉬는 날이거나 아직 식단이 안 나왔어요.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
