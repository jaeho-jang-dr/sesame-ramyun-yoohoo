"use client";

import { useAuthStore } from '@/lib/auth';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Send, Trash2, ArrowLeft, Loader2, MessageCircle } from 'lucide-react';
import Link from 'next/link';

interface GuestBookMessage {
    id: string;
    content: string;
    userId: string;
    userName: string;
    userPhoto?: string;
    createdAt: Timestamp | null;
}

export default function GuestbookPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [messages, setMessages] = useState<GuestBookMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 실시간 메시지 구독
    useEffect(() => {
        const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as GuestBookMessage));
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "guestbook"), {
                content: newMessage,
                userId: user.uid,
                userName: user.displayName || '익명 친구',
                userPhoto: user.photoURL,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
            scrollToBottom();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("메시지를 등록하지 못했어요!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, authorId: string) => {
        if (!user || user.uid !== authorId) return;
        if (!confirm("정말 이 메시지를 지울까요?")) return;

        try {
            await deleteDoc(doc(db, "guestbook", id));
        } catch (error) {
            console.error("Error deleting document: ", error);
            alert("삭제에 실패했어요.");
        }
    };

    // 날짜 포맷팅
    const formatDate = (timestamp: Timestamp | null) => {
        if (!timestamp) return "";
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('ko-KR', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pb-24">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-sm p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between border-b border-gray-100">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    친구들 방명록
                </h1>
                <div className="w-10"></div> {/* Spacer */}
            </header>

            {/* Message List */}
            <main className="max-w-2xl mx-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-2">
                        <MessageCircle className="w-12 h-12 opacity-20" />
                        <p>아직 아무도 다녀가지 않았어요.<br />첫 번째 주인공이 되어주세요!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${user?.uid === msg.userId ? 'flex-row-reverse' : ''}`}>
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                {msg.userPhoto ? (
                                    <img src={msg.userPhoto} alt={msg.userName} className="w-10 h-10 rounded-full border border-gray-200" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                                        😊
                                    </div>
                                )}
                            </div>

                            {/* Bubble */}
                            <div className={`flex flex-col max-w-[70%] ${user?.uid === msg.userId ? 'items-end' : 'items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-gray-600">{msg.userName}</span>
                                    <span className="text-[10px] text-gray-400">{formatDate(msg.createdAt)}</span>
                                </div>
                                <div className={`p-3 rounded-2xl text-sm shadow-sm relative group ${user?.uid === msg.userId
                                        ? 'bg-green-100 text-green-900 rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.content}

                                    {user?.uid === msg.userId && (
                                        <button
                                            onClick={() => handleDelete(msg.id, msg.userId)}
                                            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                            title="삭제"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                <div className="max-w-2xl mx-auto">
                    {user ? (
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="친구들에게 따뜻한 말을 남겨주세요!"
                                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || isSubmitting}
                                className="bg-green-500 text-white p-3 rounded-xl hover:bg-green-600 transition-colors disabled:bg-gray-300 flex items-center justify-center shadow-lg shadow-green-100"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-2">
                            <Link href="/login" className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg">
                                로그인하고 글 남기기 🔒
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
