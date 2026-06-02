"use client";

import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Home, Trash2, MessageCircle, LayoutGrid, Loader2, Eye, EyeOff, Pencil, X, Save } from 'lucide-react';
import { collection, onSnapshot, orderBy, query, deleteDoc, updateDoc, doc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GuestBookMessage {
    id: string;
    message: string;
    authorId: string;
    authorName: string;
    authorEmoji?: string;
    commentCount?: number;
    createdAt: Timestamp | null;
}

interface AppData {
    id: string;
    name: string;
    description: string;
    link: string;
    iconKey?: string;
    themeKey?: string;
    isVisible?: boolean; // New field for visibility
}

export default function AdminPage() {
    const { user, isAdmin, loading } = useAuthStore();
    const router = useRouter();
    const [messages, setMessages] = useState<GuestBookMessage[]>([]);
    const [apps, setApps] = useState<AppData[]>([]);

    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    // Edit State
    const [editingApp, setEditingApp] = useState<AppData | null>(null);
    const [editForm, setEditForm] = useState<Partial<AppData>>({});

    // Initial Auth Check
    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            alert("관리자만 접근할 수 있습니다!");
            router.push('/');
        }
    }, [user, isAdmin, loading, router]);

    // Fetch Guestbook Messages & Apps
    useEffect(() => {
        if (!isAdmin) return;

        // Guestbook Listener
        const qMessages = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(qMessages, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as GuestBookMessage));
            setMessages(msgs);
        });

        // Apps Listener
        const qApps = query(collection(db, "apps"), orderBy("createdAt", "asc"));
        const unsubApps = onSnapshot(qApps, (snapshot) => {
            const appList = snapshot.docs.map(doc => ({
                id: doc.id,
                isVisible: true, // Default to true if missing
                ...doc.data()
            } as AppData));
            setApps(appList);
        });

        return () => {
            unsubMessages();
            unsubApps();
        };
    }, [isAdmin]);

    const handleDeleteMessage = async (id: string) => {
        if (!confirm("이 방명록 글을 삭제하시겠습니까? (달린 답글도 함께 삭제됩니다)")) return;
        setIsDeleting(id);
        try {
            // 백오피스 삭제: 답글 서브컬렉션 먼저 정리 후 본문 삭제
            const commentsSnap = await getDocs(collection(db, "guestbook", id, "comments"));
            await Promise.all(commentsSnap.docs.map((c) => deleteDoc(c.ref)));
            await deleteDoc(doc(db, "guestbook", id));
        } catch (error) {
            console.error("Delete failed", error);
            alert("삭제에 실패했습니다.");
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDeleteApp = async (id: string, name: string) => {
        if (!confirm(`'${name}' 앱을 삭제하시겠습니까?`)) return;
        try {
            await deleteDoc(doc(db, "apps", id));
        } catch (error) {
            console.error(error);
            alert("앱 삭제 실패");
        }
    };

    const handleToggleVisibility = async (app: AppData) => {
        const newStatus = !app.isVisible;
        const confirmMsg = newStatus
            ? `'${app.name}' 앱을 다시 보이게 설정하시겠습니까?`
            : `'${app.name}' 앱을 일반 사용자에게서 숨기시겠습니까?`;

        if (!confirm(confirmMsg)) return;

        try {
            await updateDoc(doc(db, "apps", app.id), {
                isVisible: newStatus
            });
        } catch (error) {
            console.error(error);
            alert("상태 변경 실패");
        }
    };

    const startEditing = (app: AppData) => {
        setEditingApp(app);
        setEditForm({ ...app });
    };

    const handleSaveEdit = async () => {
        if (!editingApp || !editForm.name) return;
        try {
            await updateDoc(doc(db, "apps", editingApp.id), {
                name: editForm.name,
                description: editForm.description,
                link: editForm.link,
            });
            setEditingApp(null);
            setEditForm({});
        } catch (error) {
            console.error(error);
            alert("수정 실패");
        }
    };

    const formatDate = (timestamp: Timestamp | null) => {
        if (!timestamp) return "-";
        return new Intl.DateTimeFormat('ko-KR', {
            month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(timestamp.toDate());
    };

    if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Link
                        href="/"
                        className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-all border border-gray-100 hover:border-purple-100"
                        title="첫 페이지로 돌아가기"
                    >
                        <Home className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-black text-gray-800">👑 관리자 대시보드</h1>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary external avatar URL */}
                    <img src={user?.photoURL || ''} className="w-10 h-10 rounded-full border-2 border-purple-500 bg-gray-200" alt="Profile" />
                    <div className="text-right">
                        <p className="font-bold text-gray-800 text-sm">{user?.displayName}님</p>
                        <p className="text-xs text-purple-600 font-bold">Administrator</p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2">
                {/* Guestbook Management */}
                <div className="bg-white p-6 rounded-2xl shadow-md h-[calc(100vh-200px)] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                            <MessageCircle className="w-5 h-5 text-green-600" />
                            방명록 관리 <span className="text-sm font-normal text-gray-400">({messages.length})</span>
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
                                <p>등록된 방명록 글이 없습니다.</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-base">{msg.authorEmoji || "😊"}</span>
                                            <span className="font-bold text-sm text-gray-800">{msg.authorName}</span>
                                            <span className="text-xs text-gray-400">{formatDate(msg.createdAt)}</span>
                                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                <MessageCircle className="w-3 h-3" />
                                                답글 {msg.commentCount ?? 0}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteMessage(msg.id)}
                                            className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            disabled={isDeleting === msg.id}
                                            title="글 삭제 (답글 포함)"
                                        >
                                            {isDeleting === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <p className="text-gray-600 text-sm break-keep leading-relaxed">{msg.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* App Management */}
                <div className="bg-white p-6 rounded-2xl shadow-md h-[calc(100vh-200px)] flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
                            <LayoutGrid className="w-5 h-5 text-purple-600" />
                            앱 관리 <span className="text-sm font-normal text-gray-400">({apps.length})</span>
                        </h2>
                        <Link href="/apps" className="text-xs font-bold text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors">
                            앱니버스로 이동 →
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {apps.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <LayoutGrid className="w-12 h-12 mb-2 opacity-20" />
                                <p>등록된 앱이 없습니다.</p>
                            </div>
                        ) : (
                            apps.map((app) => (
                                <div
                                    key={app.id}
                                    className={`p-4 rounded-xl border transition-colors flex items-center justify-between group
                                        ${app.isVisible ? 'bg-gray-50 border-gray-100 hover:border-purple-200' : 'bg-gray-100 border-gray-200 opacity-70'}
                                    `}
                                >
                                    <div className="flex-1 min-w-0 mr-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-gray-800 truncate">{app.name}</h3>
                                            {!app.isVisible && (
                                                <span className="px-1.5 py-0.5 bg-gray-200 text-gray-500 text-[10px] rounded font-bold">비공개</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{app.description}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Toggle Visibility */}
                                        <button
                                            onClick={() => handleToggleVisibility(app)}
                                            className={`p-2 rounded-lg transition-colors ${app.isVisible ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'}`}
                                            title={app.isVisible ? "숨기기 (비공개 처리)" : "보이기 (공개 처리)"}
                                        >
                                            {app.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                        </button>

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => startEditing(app)}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="앱 정보 수정"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDeleteApp(app.id, app.name)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="앱 삭제"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Edit App Modal */}
            {editingApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">✏️</span>
                                <h2 className="text-xl font-bold text-gray-900">앱 정보 수정</h2>
                            </div>
                            <button onClick={() => setEditingApp(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">앱 이름</label>
                                <input
                                    type="text"
                                    value={editForm.name || ''}
                                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                                    placeholder="앱 이름을 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">설명</label>
                                <input
                                    type="text"
                                    value={editForm.description || ''}
                                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                                    placeholder="간단한 설명을 입력하세요"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">링크 주소</label>
                                <input
                                    type="text"
                                    value={editForm.link || ''}
                                    onChange={e => setEditForm({ ...editForm, link: e.target.value })}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
                                    placeholder="https:// 또는 /games/파일명.html"
                                />
                            </div>

                            <div className="flex gap-2 mt-6 pt-2">
                                <button
                                    onClick={() => setEditingApp(null)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    저장하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
