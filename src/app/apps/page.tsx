"use client";

import Link from "next/link";
import { ArrowLeft, Rocket, ExternalLink, Plus, Trash2, Brain, Camera, Gamepad2, Star, Heart, Music, Video, Book, Palette, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, getDocs, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthStore } from "@/lib/auth";

// Icon Mapping System
const ICON_MAP: Record<string, any> = {
    'brain': Brain,
    'camera': Camera,
    'gamepad': Gamepad2,
    'rocket': Rocket,
    'star': Star,
    'heart': Heart,
    'music': Music,
    'video': Video,
    'book': Book,
    'palette': Palette,
    'zap': Zap,
};

// Color Theme System
const COLOR_THEMES: Record<string, { bg: string, text: string, decoration: string }> = {
    'yellow': { bg: 'bg-yellow-400', text: 'text-yellow-900', decoration: 'bg-yellow-400' },
    'green': { bg: 'bg-green-400', text: 'text-green-900', decoration: 'bg-green-400' },
    'red': { bg: 'bg-red-400', text: 'text-red-900', decoration: 'bg-red-400' },
    'blue': { bg: 'bg-blue-400', text: 'text-blue-900', decoration: 'bg-blue-400' },
    'purple': { bg: 'bg-purple-400', text: 'text-purple-900', decoration: 'bg-purple-400' },
    'pink': { bg: 'bg-pink-400', text: 'text-pink-900', decoration: 'bg-pink-400' },
    'orange': { bg: 'bg-orange-400', text: 'text-orange-900', decoration: 'bg-orange-400' },
    'indigo': { bg: 'bg-indigo-400', text: 'text-indigo-900', decoration: 'bg-indigo-400' },
};

interface AppData {
    id: string;
    name: string;
    description: string;
    url: string;
    iconKey: string;
    themeKey: string;
    createdAt: number;
    isVisible?: boolean; // Visibility field
}

// Initial Apps Data for Reset
const INITIAL_APPS = [
    {
        name: '논리수학 퀴즈',
        description: '재미있는 수학 퍼즐을 풀어보자!',
        url: 'https://jaeho-jang-dr.github.io/haewan-logic-math-quiz/',
        iconKey: 'brain',
        themeKey: 'yellow',
        isVisible: true
    },
    {
        name: '혜완 프렌즈',
        description: '우리들의 추억 사진관',
        url: 'https://hey-friends.vercel.app',
        iconKey: 'camera',
        themeKey: 'green',
        isVisible: true
    },
    {
        name: '동물 텍스트 배틀',
        description: '강력한 동물 친구들과의 텍스트 배틀!',
        url: 'https://kid-text-battle.vercel.app/',
        iconKey: 'gamepad',
        themeKey: 'red',
        isVisible: true
    },
];

export default function AppniversePage() {
    const { user, isAdmin } = useAuthStore();
    const [apps, setApps] = useState<AppData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Abstracted Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
        iconKey: 'rocket',
        themeKey: 'blue',
    });

    useEffect(() => {
        const q = query(collection(db, "apps"), orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const appList = snapshot.docs.map(doc => ({
                id: doc.id,
                isVisible: true, // Default to true if not present
                ...doc.data()
            } as AppData));
            setApps(appList);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleInitialize = async () => {
        if (!confirm("기본 앱 데이터를 추가하시겠습니까?")) return;
        try {
            const batch = writeBatch(db);
            INITIAL_APPS.forEach(app => {
                const docRef = doc(collection(db, "apps"));
                batch.set(docRef, { ...app, createdAt: Date.now() });
            });
            await batch.commit();
            alert("초기화 완료!");
        } catch (error) {
            console.error(error);
            alert("초기화 실패");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`'${name}' 앱을 삭제하시겠습니까?`)) return;
        try {
            await deleteDoc(doc(db, "apps", id));
        } catch (error) {
            console.error(error);
            alert("삭제 실패");
        }
    };

    const handleAddApp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "apps"), {
                ...formData,
                createdAt: Date.now(),
                isVisible: true // Default visible
            });
            setIsModalOpen(false);
            setFormData({
                name: '',
                description: '',
                url: '',
                iconKey: 'rocket',
                themeKey: 'blue',
            });
        } catch (error) {
            console.error(error);
            alert("추가 실패");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }}></div>

            {/* Header */}
            <header className="p-6 relative z-10 flex items-center justify-between">
                <Link href="/" className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-md">
                    <ArrowLeft className="w-6 h-6 text-white" />
                </Link>
                <div className="flex items-center gap-2">
                    <Rocket className="w-6 h-6 text-purple-400 animate-bounce" />
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        앱니버스 (Appniverse)
                    </h1>
                </div>
                <div className="w-12"></div> {/* Spacer for center alignment */}
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto p-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                        모든 앱이 연결되는 곳,<br />
                        <span className="text-purple-400">혜완 유니버스</span>에 오신 것을 환영해요! 🪐
                    </h2>
                    <p className="text-slate-400 text-lg">원하는 앱으로 여행을 떠나볼까요?</p>
                </div>

                {/* Initializing for Admin when empty */}
                {isAdmin && apps.length === 0 && !loading && (
                    <div className="text-center mb-8">
                        <button
                            onClick={handleInitialize}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all shadow-lg hover:shadow-blue-500/50"
                        >
                            🚀 초기 앱 데이터 자동 생성하기
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add App Button for Admin */}
                    {isAdmin && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative h-full min-h-[300px] border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 rounded-3xl flex flex-col items-center justify-center transition-all bg-purple-500/5 hover:bg-purple-500/10"
                        >
                            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus className="w-8 h-8 text-purple-400" />
                            </div>
                            <span className="text-purple-300 font-bold text-lg">새로운 앱 추가하기</span>
                        </button>
                    )}

                    {apps.map((app) => {
                        // Visibility Logic: Hide invisible apps for non-admins
                        if (!isAdmin && app.isVisible === false) return null;

                        const IconComponent = ICON_MAP[app.iconKey] || Rocket;
                        const theme = COLOR_THEMES[app.themeKey] || COLOR_THEMES['blue'];
                        const isHidden = app.isVisible === false;

                        return (
                            <div key={app.id} className={`group relative block h-full ${isHidden ? 'opacity-50 grayscale' : ''}`}>
                                {/* Admin Actions */}
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                                        {isHidden && (
                                            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-xs font-bold rounded-lg border border-gray-600 bg-opacity-80 backdrop-blur-sm">
                                                🔒 비공개
                                            </span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent link click
                                                handleDelete(app.id, app.name);
                                            }}
                                            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                            title="앱 삭제"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                <a
                                    href={app.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block h-full"
                                >
                                    <div className={`
                                        absolute inset-0 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300
                                        ${theme.decoration}
                                    `}></div>
                                    <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:-translate-y-2 hover:border-white/30 transition-all duration-300 h-full flex flex-col items-center text-center group-hover:bg-slate-800/80">
                                        <div className={`w-20 h-20 rounded-2xl ${theme.bg} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className={`w-10 h-10 ${theme.text}`} />
                                        </div>

                                        <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">{app.name}</h3>
                                        <p className="text-slate-400 mb-6 flex-1 break-keep">{app.description}</p>

                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-300 group-hover:text-white transition-colors bg-white/5 py-2 px-4 rounded-full">
                                            <span>실행하기</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </div>
                                    </div>
                                </a>
                            </div>
                        );
                    })}

                    {/* Coming Soon Card */}
                    {!isAdmin && (
                        <div className="bg-slate-800/30 border border-dashed border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center min-h-[300px] hover:bg-slate-800/50 transition-colors cursor-default">
                            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-3xl">
                                🚀
                            </div>
                            <h3 className="text-xl font-bold text-slate-500 mb-2">새로운 앱 준비 중...</h3>
                            <p className="text-slate-600 text-sm">다음에 또 만나요!</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Add App Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-800 rounded-3xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white text-center">✨ 새로운 앱 추가</h2>
                        <form onSubmit={handleAddApp} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">앱 이름</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="예: 재미있는 퀴즈"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">설명</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="앱에 대한 간단한 설명"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">URL 주소</label>
                                <input
                                    required
                                    type="url"
                                    value={formData.url}
                                    onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500"
                                    placeholder="https://"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">아이콘</label>
                                    <select
                                        value={formData.iconKey}
                                        onChange={e => setFormData({ ...formData, iconKey: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 appearance-none"
                                    >
                                        {Object.keys(ICON_MAP).map(key => (
                                            <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">테마 색상</label>
                                    <select
                                        value={formData.themeKey}
                                        onChange={e => setFormData({ ...formData, themeKey: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 appearance-none"
                                    >
                                        {Object.keys(COLOR_THEMES).map(key => (
                                            <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all shadow-lg shadow-purple-500/30"
                                >
                                    추가하기
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
