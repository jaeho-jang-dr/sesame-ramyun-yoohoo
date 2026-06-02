"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Plus, Star, BookOpen } from "lucide-react";
import { useStore } from "@/store";

export default function BooksPage() {
    const { books, addBook } = useStore();
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(5);
    const [memo, setMemo] = useState("");

    const handleSubmit = () => {
        if (!title) return;
        addBook({
            id: Date.now(),
            title,
            rating,
            memo,
            date: new Date().toLocaleDateString('ko-KR')
        });
        // Reset and close
        setTitle("");
        setRating(5);
        setMemo("");
        setIsFormOpen(false);
    };

    return (
        <div className="min-h-screen bg-pink-50">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">📚 독서 기록장</h1>
                        <p className="text-xs text-pink-500 font-bold">{books.length}권의 책을 읽었어요!</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-pink-600 transition-colors shadow-md"
                >
                    <Plus className="w-4 h-4" />
                    책 읽었어요!
                </button>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Form (Modal-like inline expansion) */}
                {isFormOpen && (
                    <div className="bg-white p-6 rounded-3xl shadow-lg border-2 border-pink-100 animation-fade-in">
                        <h2 className="text-lg font-bold text-pink-600 mb-4">어떤 책을 읽었나요?</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="책 제목"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
                                autoFocus
                            />

                            <div>
                                <label className="block text-sm font-bold text-gray-500 mb-2">재미있었나요?</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-110 active:scale-95"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <textarea
                                placeholder="짧은 감상평을 남겨보세요 (선택)"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300 resize-none h-20"
                            />

                            <button
                                onClick={handleSubmit}
                                disabled={!title}
                                className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
                            >
                                저장하기
                            </button>
                        </div>
                    </div>
                )}

                {/* Book List */}
                <div className="grid gap-4">
                    {books.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 space-y-2">
                            <BookOpen className="w-16 h-16 mx-auto opacity-30" />
                            <p>아직 읽은 책이 없어요.</p>
                            <p className="text-sm">독서왕이 되어보세요!</p>
                        </div>
                    ) : (
                        [...books].reverse().map((book) => (
                            <div key={book.id} className="relative bg-white p-5 rounded-2xl shadow-sm border border-transparent hover:border-pink-200 transition-all flex flex-col gap-2 overflow-hidden">
                                {/* 독서 요정 칭찬 배지 스티커 */}
                                <Image
                                    src="/images/badge_reading.png"
                                    alt="독서 요정 배지"
                                    width={60}
                                    height={60}
                                    className="absolute -bottom-2 -right-2 opacity-90 rotate-12 drop-shadow-md pointer-events-none select-none"
                                />
                                <div className="flex items-start justify-between pr-12">
                                    <h3 className="text-lg font-bold text-gray-800 break-keep leading-tight">{book.title}</h3>
                                    <div className="flex shrink-0">
                                        {[...Array(book.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                                {book.memo && (
                                    <p className="text-gray-600 bg-pink-50 p-3 rounded-lg text-sm">
                                        {book.memo}
                                    </p>
                                )}
                                <p className="text-xs text-gray-400 text-right mt-1 pr-12">{book.date}</p>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
