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
    increment,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
    ArrowLeft,
    Send,
    Heart,
    MessageCircle,
    Trash2,
    Edit3,
    Check,
    Star,
    ThumbsUp,
    PartyPopper,
    Flame,
    LayoutGrid,
    List as ListIcon,
    CornerDownRight,
} from "lucide-react";

interface ReactionUser {
    uid: string;
    name: string;
}

interface GuestbookEntry {
    id: string;
    message: string;
    authorId: string;
    authorName: string;
    authorEmoji: string;
    reactions: { [emoji: string]: ReactionUser[] };
    commentCount?: number;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

interface CommentItem {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    authorEmoji?: string;
    createdAt: Timestamp | null;
}

const EMOJI_OPTIONS = ["😊", "😎", "🤗", "🦊", "🐰", "🐱", "🐶", "🦁", "🐼", "🐨", "🦋", "🌸"];

const REACTION_EMOJIS = [
    { emoji: "❤️", icon: Heart },
    { emoji: "👍", icon: ThumbsUp },
    { emoji: "⭐", icon: Star },
    { emoji: "🔥", icon: Flame },
    { emoji: "🎉", icon: PartyPopper },
];

// 구버전 reactions(uid 문자열 배열) → 신버전(ReactionUser[]) 정규화
const normalizeReactions = (
    raw: unknown
): { [emoji: string]: ReactionUser[] } => {
    const out: { [emoji: string]: ReactionUser[] } = {};
    if (!raw || typeof raw !== "object") return out;
    for (const [emoji, arr] of Object.entries(raw as Record<string, unknown>)) {
        if (!Array.isArray(arr)) continue;
        out[emoji] = arr.map((u) =>
            typeof u === "string"
                ? { uid: u, name: "익명" }
                : { uid: (u as ReactionUser).uid, name: (u as ReactionUser).name || "익명" }
        );
    }
    return out;
};

const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;

    return date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
    });
};

export default function GuestbookPage() {
    const { user, isAdmin } = useAuthStore();
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");
    const [selectedEmoji, setSelectedEmoji] = useState("😊");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editMessage, setEditMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // 뷰 토글 (카드형 / 리스트형)
    const [viewMode, setViewMode] = useState<"card" | "list">("list");

    // 댓글 상태
    const [openComments, setOpenComments] = useState<string | null>(null);
    const [commentsMap, setCommentsMap] = useState<{ [messageId: string]: CommentItem[] }>({});
    const [commentInput, setCommentInput] = useState<{ [messageId: string]: string }>({});
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const entriesList = snapshot.docs.map((d) => {
                const data = d.data();
                return {
                    id: d.id,
                    ...data,
                    reactions: normalizeReactions(data.reactions),
                } as GuestbookEntry;
            });
            setEntries(entriesList);
        } catch (error) {
            console.error("Error fetching entries:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!newMessage.trim() || !user || submitting) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "guestbook"), {
                message: newMessage.trim(),
                authorId: user.uid,
                authorName: user.displayName || "익명",
                authorEmoji: selectedEmoji,
                reactions: {},
                commentCount: 0,
                createdAt: serverTimestamp(),
            });

            setNewMessage("");
            fetchEntries();
        } catch (error) {
            console.error("Error adding entry:", error);
            alert("작성에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async (entryId: string) => {
        if (!editMessage.trim()) return;

        try {
            await updateDoc(doc(db, "guestbook", entryId), {
                message: editMessage.trim(),
                updatedAt: serverTimestamp(),
            });

            setEditingId(null);
            setEditMessage("");
            fetchEntries();
        } catch (error) {
            console.error("Error updating entry:", error);
            alert("수정에 실패했습니다.");
        }
    };

    const handleDelete = async (entryId: string) => {
        if (!confirm("정말 삭제할까요? (답글도 함께 삭제됩니다)")) return;

        try {
            // 하위 답글 먼저 삭제
            const commentsSnap = await getDocs(collection(db, "guestbook", entryId, "comments"));
            await Promise.all(commentsSnap.docs.map((c) => deleteDoc(c.ref)));
            await deleteDoc(doc(db, "guestbook", entryId));
            setEntries((prev) => prev.filter((e) => e.id !== entryId));
        } catch (error) {
            console.error("Error deleting entry:", error);
            alert("삭제에 실패했습니다.");
        }
    };

    const handleReaction = async (entryId: string, emoji: string) => {
        if (!user) {
            alert("로그인이 필요합니다.");
            return;
        }

        const entry = entries.find((e) => e.id === entryId);
        if (!entry) return;

        const currentReactions = entry.reactions || {};
        const emojiReactions = currentReactions[emoji] || [];
        const hasReacted = emojiReactions.some((u) => u.uid === user.uid);

        const newReactions: { [emoji: string]: ReactionUser[] } = { ...currentReactions };

        if (hasReacted) {
            newReactions[emoji] = emojiReactions.filter((u) => u.uid !== user.uid);
        } else {
            newReactions[emoji] = [
                ...emojiReactions,
                { uid: user.uid, name: user.displayName || "익명" },
            ];
        }

        // 빈 배열 정리
        Object.keys(newReactions).forEach((key) => {
            if (newReactions[key].length === 0) {
                delete newReactions[key];
            }
        });

        // 낙관적 업데이트
        const prevEntries = entries;
        setEntries(entries.map((e) => (e.id === entryId ? { ...e, reactions: newReactions } : e)));

        try {
            await updateDoc(doc(db, "guestbook", entryId), {
                reactions: newReactions,
            });
        } catch (error) {
            console.error("Error updating reaction:", error);
            setEntries(prevEntries); // 롤백
        }
    };

    // ── 댓글(답글) ────────────────────────────────
    const fetchComments = async (messageId: string) => {
        try {
            const q = query(
                collection(db, "guestbook", messageId, "comments"),
                orderBy("createdAt", "asc")
            );
            const snap = await getDocs(q);
            const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as CommentItem[];
            setCommentsMap((prev) => ({ ...prev, [messageId]: list }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const toggleComments = (messageId: string) => {
        setOpenComments((prev) => {
            const next = prev === messageId ? null : messageId;
            if (next && !commentsMap[messageId]) fetchComments(messageId);
            return next;
        });
    };

    const handleAddComment = async (messageId: string) => {
        const text = (commentInput[messageId] || "").trim();
        if (!text || !user || commentSubmitting) return;

        setCommentSubmitting(true);
        try {
            await addDoc(collection(db, "guestbook", messageId, "comments"), {
                text,
                authorId: user.uid,
                authorName: user.displayName || "익명",
                authorEmoji: selectedEmoji,
                createdAt: serverTimestamp(),
            });
            await updateDoc(doc(db, "guestbook", messageId), {
                commentCount: increment(1),
            });

            setCommentInput((prev) => ({ ...prev, [messageId]: "" }));
            setEntries((prev) =>
                prev.map((e) =>
                    e.id === messageId ? { ...e, commentCount: (e.commentCount || 0) + 1 } : e
                )
            );
            fetchComments(messageId);
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("답글 작성에 실패했습니다.");
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleDeleteComment = async (messageId: string, commentId: string) => {
        if (!confirm("이 답글을 삭제할까요?")) return;

        try {
            await deleteDoc(doc(db, "guestbook", messageId, "comments", commentId));
            await updateDoc(doc(db, "guestbook", messageId), {
                commentCount: increment(-1),
            });
            setEntries((prev) =>
                prev.map((e) =>
                    e.id === messageId
                        ? { ...e, commentCount: Math.max(0, (e.commentCount || 1) - 1) }
                        : e
                )
            );
            setCommentsMap((prev) => ({
                ...prev,
                [messageId]: (prev[messageId] || []).filter((c) => c.id !== commentId),
            }));
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("답글 삭제에 실패했습니다.");
        }
    };

    const canEditEntry = (entry: GuestbookEntry) => {
        return isAdmin || (user && user.uid === entry.authorId);
    };

    const canDeleteComment = (comment: CommentItem) => {
        return isAdmin || (user && user.uid === comment.authorId);
    };

    const startEditing = (entry: GuestbookEntry) => {
        setEditingId(entry.id);
        setEditMessage(entry.message);
    };

    // ── 단일 게시글 카드 렌더 ─────────────────────
    const renderEntry = (entry: GuestbookEntry) => {
        const isOpen = openComments === entry.id;
        const comments = commentsMap[entry.id] || [];
        const count = entry.commentCount ?? 0;

        return (
            <div
                key={entry.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
            >
                <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-green-100 text-xl flex items-center justify-center flex-shrink-0">
                        {entry.authorEmoji || "😊"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-800">
                                    {entry.authorName}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {formatDate(entry.createdAt)}
                                </span>
                                {entry.updatedAt && (
                                    <span className="text-xs text-gray-400">(수정됨)</span>
                                )}
                            </div>
                            {canEditEntry(entry) && (
                                <div className="flex gap-1 flex-shrink-0">
                                    <button
                                        onClick={() => startEditing(entry)}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="수정"
                                    >
                                        <Edit3 className="w-3.5 h-3.5 text-gray-400" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(entry.id)}
                                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                        title={isAdmin ? "관리자 삭제 (휴지통)" : "삭제"}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {editingId === entry.id ? (
                            <div className="space-y-3">
                                <textarea
                                    value={editMessage}
                                    onChange={(e) => setEditMessage(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                    rows={3}
                                />
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm"
                                    >
                                        취소
                                    </button>
                                    <button
                                        onClick={() => handleUpdate(entry.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                                    >
                                        <Check className="w-4 h-4" />
                                        저장
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700 whitespace-pre-wrap break-words">
                                {entry.message}
                            </p>
                        )}

                        {/* Reactions */}
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            {REACTION_EMOJIS.map(({ emoji }) => {
                                const reactions = entry.reactions?.[emoji] || [];
                                const hasReacted =
                                    user && reactions.some((u) => u.uid === user.uid);
                                const reactCount = reactions.length;

                                return (
                                    <div key={emoji} className="relative group/reaction">
                                        <button
                                            onClick={() => handleReaction(entry.id, emoji)}
                                            className={`
                                                flex items-center gap-1 px-2.5 py-1 rounded-full
                                                text-sm transition-all
                                                ${hasReacted
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }
                                                ${reactCount > 0 ? "" : "opacity-50 hover:opacity-100"}
                                            `}
                                        >
                                            <span>{emoji}</span>
                                            {reactCount > 0 && (
                                                <span className="font-medium">{reactCount}</span>
                                            )}
                                        </button>

                                        {/* 마우스오버 시 반응한 사용자 실명 목록 툴팁 */}
                                        {reactCount > 0 && (
                                            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/reaction:block z-20 w-max max-w-[200px]">
                                                <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-lg whitespace-normal break-keep">
                                                    {reactions.map((u) => u.name).join(", ")}
                                                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* 답글 토글 */}
                            <button
                                onClick={() => toggleComments(entry.id)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-sm transition-all ml-auto ${
                                    isOpen
                                        ? "bg-emerald-100 text-emerald-700"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                title="답글 보기"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span className="font-medium">{count}</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        {isOpen && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                {comments.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-2">
                                        아직 답글이 없어요. 첫 답글을 남겨보세요!
                                    </p>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="flex items-start gap-2">
                                            <CornerDownRight className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
                                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-base flex items-center justify-center flex-shrink-0">
                                                {comment.authorEmoji || "💬"}
                                            </div>
                                            <div className="flex-1 min-w-0 bg-gray-50 rounded-xl px-3 py-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-sm font-semibold text-gray-800">
                                                            {comment.authorName}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400">
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                    </div>
                                                    {canDeleteComment(comment) && (
                                                        <button
                                                            onClick={() =>
                                                                handleDeleteComment(entry.id, comment.id)
                                                            }
                                                            className="p-1 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                                                            title={isAdmin ? "관리자 삭제" : "삭제"}
                                                        >
                                                            <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words mt-0.5">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* 답글 입력 */}
                                {user ? (
                                    <div className="flex items-center gap-2 pt-1">
                                        <input
                                            type="text"
                                            value={commentInput[entry.id] || ""}
                                            onChange={(e) =>
                                                setCommentInput((prev) => ({
                                                    ...prev,
                                                    [entry.id]: e.target.value,
                                                }))
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleAddComment(entry.id);
                                            }}
                                            placeholder="답글을 입력하세요..."
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                                        />
                                        <button
                                            onClick={() => handleAddComment(entry.id)}
                                            disabled={!(commentInput[entry.id] || "").trim() || commentSubmitting}
                                            className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="답글 남기기"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-400 text-center">
                                        답글을 남기려면 로그인하세요.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">📝</span>
                            <h1 className="text-xl font-bold text-gray-900">방문자 게시판</h1>
                        </div>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {entries.length}개의 글
                    </span>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-6">
                {/* Hero */}
                <section className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-2 right-10 text-5xl">💬</div>
                        <div className="absolute bottom-2 left-10 text-5xl">✏️</div>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl md:text-2xl font-bold mb-1">친구들의 이야기</h2>
                        <p className="text-green-100 text-sm">응원의 메시지를 남겨주세요! 💚</p>
                    </div>
                </section>

                {/* Write Form */}
                {user ? (
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-6">
                        <div className="flex items-start gap-3">
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className="w-12 h-12 rounded-xl bg-green-100 text-2xl flex items-center justify-center hover:bg-green-200 transition-colors flex-shrink-0"
                            >
                                {selectedEmoji}
                            </button>
                            <div className="flex-1">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="친구들에게 메시지를 남겨보세요..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-gray-700"
                                />
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-gray-400">
                                        {user.displayName || "익명"}으로 작성됩니다
                                    </span>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!newMessage.trim() || submitting}
                                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        {submitting ? "작성 중..." : "남기기"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Emoji Picker */}
                        {showEmojiPicker && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-2">프로필 이모지 선택</p>
                                <div className="flex flex-wrap gap-2">
                                    {EMOJI_OPTIONS.map((emoji) => (
                                        <button
                                            key={emoji}
                                            onClick={() => {
                                                setSelectedEmoji(emoji);
                                                setShowEmojiPicker(false);
                                            }}
                                            className={`
                                                w-10 h-10 rounded-lg text-xl
                                                transition-all hover:scale-110
                                                ${selectedEmoji === emoji
                                                    ? "bg-green-100 ring-2 ring-green-500"
                                                    : "bg-gray-50 hover:bg-gray-100"
                                                }
                                            `}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center border border-gray-200">
                        <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 mb-3">로그인하고 메시지를 남겨보세요!</p>
                        <Link
                            href="/login"
                            className="inline-block bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition-colors font-medium text-sm"
                        >
                            로그인하기
                        </Link>
                    </div>
                )}

                {/* View Toggle */}
                {entries.length > 0 && (
                    <div className="flex justify-end mb-4">
                        <div className="inline-flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    viewMode === "list"
                                        ? "bg-white text-green-700 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <ListIcon className="w-4 h-4" />
                                리스트
                            </button>
                            <button
                                onClick={() => setViewMode("card")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                    viewMode === "card"
                                        ? "bg-white text-green-700 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                                카드
                            </button>
                        </div>
                    </div>
                )}

                {/* Entries */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">아직 글이 없어요</h3>
                        <p className="text-gray-500">첫 번째 메시지를 남겨보세요!</p>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === "card"
                                ? "grid grid-cols-1 sm:grid-cols-2 gap-4 items-start"
                                : "space-y-4"
                        }
                    >
                        {entries.map((entry) => renderEntry(entry))}
                    </div>
                )}
            </main>
        </div>
    );
}
