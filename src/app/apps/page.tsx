"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    ArrowLeft,
    Plus,
    Sparkles,
    Gamepad2,
    Calculator,
    Palette,
    Music,
    Camera,
    BookOpen,
    Globe,
    Heart,
    Star,
    Trash2,
    Edit3,
    X,
    Check,
    Rocket,
} from "lucide-react";

interface AppItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    link?: string;
    createdAt: unknown;
    createdBy: string;
    createdByName: string;
}

const ICON_OPTIONS = [
    { name: "Gamepad2", icon: Gamepad2, label: "게임" },
    { name: "Calculator", icon: Calculator, label: "계산기" },
    { name: "Palette", icon: Palette, label: "그림" },
    { name: "Music", icon: Music, label: "음악" },
    { name: "Camera", icon: Camera, label: "카메라" },
    { name: "BookOpen", icon: BookOpen, label: "책" },
    { name: "Globe", icon: Globe, label: "지구" },
    { name: "Heart", icon: Heart, label: "하트" },
    { name: "Star", icon: Star, label: "별" },
    { name: "Rocket", icon: Rocket, label: "로켓" },
];

const COLOR_OPTIONS = [
    { name: "purple", bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
    { name: "blue", bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-200" },
    { name: "green", bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
    { name: "pink", bg: "bg-pink-100", text: "text-pink-600", border: "border-pink-200" },
    { name: "orange", bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
    { name: "teal", bg: "bg-teal-100", text: "text-teal-600", border: "border-teal-200" },
    { name: "red", bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
    { name: "indigo", bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-200" },
];

const getIconComponent = (iconName: string) => {
    const found = ICON_OPTIONS.find((opt) => opt.name === iconName);
    return found ? found.icon : Sparkles;
};

const getColorClasses = (colorName: string) => {
    const found = COLOR_OPTIONS.find((opt) => opt.name === colorName);
    return found || COLOR_OPTIONS[0];
};

export default function AppsPage() {
    const { user, isAdmin } = useAuthStore();
    const [apps, setApps] = useState<AppItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingApp, setEditingApp] = useState<AppItem | null>(null);

    const [formName, setFormName] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formIcon, setFormIcon] = useState("Gamepad2");
    const [formColor, setFormColor] = useState("purple");
    const [formLink, setFormLink] = useState("");

    useEffect(() => {
        fetchApps();
    }, []);

    const fetchApps = async () => {
        try {
            const q = query(collection(db, "apps"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const appsList = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            })) as AppItem[];
            setApps(appsList);
        } catch (error) {
            console.error("Error fetching apps:", error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormName("");
        setFormDescription("");
        setFormIcon("Gamepad2");
        setFormColor("purple");
        setFormLink("");
        setEditingApp(null);
    };

    const openCreateModal = () => {
        resetForm();
        setShowModal(true);
    };

    const openEditModal = (app: AppItem) => {
        setFormName(app.name);
        setFormDescription(app.description);
        setFormIcon(app.icon);
        setFormColor(app.color);
        setFormLink(app.link || "");
        setEditingApp(app);
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!formName.trim() || !user) return;

        try {
            if (editingApp) {
                await updateDoc(doc(db, "apps", editingApp.id), {
                    name: formName.trim(),
                    description: formDescription.trim(),
                    icon: formIcon,
                    color: formColor,
                    link: formLink.trim(),
                });
            } else {
                await addDoc(collection(db, "apps"), {
                    name: formName.trim(),
                    description: formDescription.trim(),
                    icon: formIcon,
                    color: formColor,
                    link: formLink.trim(),
                    createdAt: serverTimestamp(),
                    createdBy: user.uid,
                    createdByName: user.displayName || "익명",
                });
            }

            setShowModal(false);
            resetForm();
            fetchApps();
        } catch (error) {
            console.error("Error saving app:", error);
            alert("저장에 실패했습니다.");
        }
    };

    const handleDelete = async (appId: string) => {
        if (!confirm("정말 삭제할까요?")) return;

        try {
            await deleteDoc(doc(db, "apps", appId));
            fetchApps();
        } catch (error) {
            console.error("Error deleting app:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    const canEditApp = (app: AppItem) => {
        return isAdmin || (user && user.uid === app.createdBy);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">🚀</span>
                            <h1 className="text-xl font-bold text-gray-900">혜완이의 앱니버스</h1>
                        </div>
                    </div>

                    {user && (
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors font-medium text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            새 앱 만들기
                        </button>
                    )}
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6">
                <section className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-4 left-10 text-6xl">🎮</div>
                        <div className="absolute bottom-4 right-10 text-6xl">💡</div>
                        <div className="absolute top-1/2 left-1/3 text-4xl">✨</div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">나만의 앱을 만들어보세요!</h2>
                        <p className="text-purple-100 text-sm md:text-base">
                            상상력을 발휘해서 멋진 앱 아이디어를 등록하고 친구들과 공유해요 🌟
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-sm">
                            <span className="bg-white/20 px-3 py-1 rounded-full">총 {apps.length}개의 앱</span>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
                    </div>
                ) : apps.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎨</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">아직 앱이 없어요</h3>
                        <p className="text-gray-500 mb-6">첫 번째 앱을 만들어 보세요!</p>
                        {user && (
                            <button
                                onClick={openCreateModal}
                                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-medium"
                            >
                                앱 만들기 시작
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apps.map((app) => {
                            const IconComponent = getIconComponent(app.icon);
                            const colors = getColorClasses(app.color);

                            return (
                                <div
                                    key={app.id}
                                    className={`bg-white rounded-2xl p-6 border-2 ${colors.border} hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative group`}
                                >
                                    {canEditApp(app) && (
                                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(app)}
                                                className="p-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <Edit3 className="w-3.5 h-3.5 text-gray-600" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(app.id)}
                                                className="p-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                            </button>
                                        </div>
                                    )}

                                    <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-4`}>
                                        <IconComponent className={`w-8 h-8 ${colors.text}`} />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{app.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {app.description || "설명이 없습니다"}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400">by {app.createdByName}</span>
                                        {app.link && (
                                            app.link.startsWith("/") ? (
                                                <Link
                                                    href={app.link}
                                                    className={`text-xs font-medium ${colors.text} hover:underline`}
                                                >
                                                    실행하기 →
                                                </Link>
                                            ) : (
                                                <a
                                                    href={app.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`text-xs font-medium ${colors.text} hover:underline`}
                                                >
                                                    실행하기 →
                                                </a>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingApp ? "앱 수정하기" : "새 앱 만들기"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">앱 이름 *</label>
                                <input
                                    type="text"
                                    value={formName}
                                    onChange={(e) => setFormName(e.target.value)}
                                    placeholder="예: 나만의 계산기"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    placeholder="어떤 앱인가요?"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">아이콘 선택</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {ICON_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        return (
                                            <button
                                                key={opt.name}
                                                onClick={() => setFormIcon(opt.name)}
                                                className={`p-3 rounded-xl border-2 transition-all ${
                                                    formIcon === opt.name
                                                        ? "border-purple-500 bg-purple-50"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <Icon
                                                    className={`w-5 h-5 mx-auto ${
                                                        formIcon === opt.name ? "text-purple-600" : "text-gray-500"
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">색상 선택</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.name}
                                            onClick={() => setFormColor(opt.name)}
                                            className={`w-10 h-10 rounded-full ${opt.bg} border-2 transition-all ${
                                                formColor === opt.name
                                                    ? "border-gray-800 scale-110"
                                                    : "border-transparent hover:scale-105"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">링크 주소</label>
                                <input
                                    type="url"
                                    value={formLink}
                                    onChange={(e) => setFormLink(e.target.value)}
                                    placeholder="https:// 또는 /games/파일명.html"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!formName.trim()}
                                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Check className="w-4 h-4" />
                                {editingApp ? "저장하기" : "만들기"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
