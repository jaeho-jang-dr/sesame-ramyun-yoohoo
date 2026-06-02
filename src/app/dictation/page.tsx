"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Play, RefreshCw, Trophy } from "lucide-react";
import { useStore } from "@/store";
import confetti from "canvas-confetti";

export default function DictationPage() {
    const { words, addWord } = useStore();
    const [mode, setMode] = useState<'list' | 'practice'>('list');
    const [newWord, setNewWord] = useState('');

    // Practice State
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // Audio synthesis reference (Web Speech API)
    const speak = (text: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ko-KR';
            utterance.rate = 0.8; // Slightly slower for kids
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleAddWord = () => {
        if (!newWord) return;
        addWord(newWord);
        setNewWord('');
    };

    const startPractice = () => {
        if (words.length === 0) return;
        setMode('practice');
        setCurrentIdx(0);
        setScore(0);
        setAnswer('');
        setShowResult(false);
        // Speak first word after a short delay
        setTimeout(() => speak(words[0].text), 500);
    };

    const checkAnswer = () => {
        const isCorrect = answer.trim() === words[currentIdx].text;
        if (isCorrect) {
            setScore(s => s + 1);
            confetti({ particleCount: 50, origin: { x: 0.5, y: 0.7 } });
        } else {
            // Maybe show correct answer feedback? For now simple flow
            alert(`땡! 정답은 [${words[currentIdx].text}] 입니다.`);
        }

        if (currentIdx < words.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setAnswer('');
            setTimeout(() => speak(words[currentIdx + 1].text), 500);
        } else {
            setShowResult(true);
            if (score + (isCorrect ? 1 : 0) === words.length) {
                confetti({ particleCount: 200, spread: 100 });
            }
        }
    };

    const activeWord = words[currentIdx]?.text;

    return (
        <div className="min-h-screen bg-yellow-50">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">✍️ 받아쓰기</h1>
            </header>

            <main className="max-w-md mx-auto p-4">
                {mode === 'list' && (
                    <div className="space-y-6">
                        {/* Input */}
                        <div className="bg-white p-5 rounded-2xl shadow-md border-2 border-yellow-100">
                            <h2 className="text-lg font-bold text-yellow-700 mb-3">단어 추가하기</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newWord}
                                    onChange={(e) => setNewWord(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddWord()}
                                    placeholder="예: 참깨라면"
                                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <button
                                    onClick={handleAddWord}
                                    className="bg-yellow-500 text-white p-3 rounded-xl hover:bg-yellow-600 transition-colors"
                                >
                                    <Plus />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div>
                            <div className="flex justify-between items-center mb-2 px-2">
                                <h3 className="font-bold text-gray-500">등록된 단어 ({words.length})</h3>
                                {words.length > 0 && (
                                    <button
                                        onClick={startPractice}
                                        className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-lg hover:translate-y-1"
                                    >
                                        <Play className="w-5 h-5" />
                                        연습 시작
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {words.map((word) => (
                                    <span key={word.id} className="bg-white px-4 py-2 rounded-xl shadow-sm border border-yellow-100 text-lg font-medium text-gray-700">
                                        {word.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {mode === 'practice' && !showResult && (
                    <div className="text-center py-10 space-y-8">
                        <div className="space-y-2">
                            <p className="text-gray-500 font-medium">문제 {currentIdx + 1} / {words.length}</p>
                            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-yellow-500 h-full transition-all duration-300"
                                    style={{ width: `${((currentIdx) / words.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        <div className="py-10">
                            <button
                                onClick={() => speak(activeWord)}
                                className="bg-yellow-100 p-8 rounded-full mb-4 hover:scale-105 transition-transform active:scale-95 shadow-md"
                            >
                                <div className="text-6xl">🔊</div>
                            </button>
                            <p className="text-gray-500">버튼을 눌러 소리를 들어보세요!</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                placeholder="받아써보세요"
                                className="w-full p-4 text-center text-2xl font-bold bg-white border-2 border-yellow-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-200"
                                autoFocus
                            />
                            <button
                                onClick={checkAnswer}
                                className="w-full py-4 bg-yellow-500 text-white text-xl font-bold rounded-2xl hover:bg-yellow-600 shadow-lg active:translate-y-0.5 transition-all"
                            >
                                정답 확인
                            </button>
                        </div>
                    </div>
                )}

                {mode === 'practice' && showResult && (
                    <div className="text-center py-10 space-y-8 bg-white rounded-3xl shadow-xl p-8 border-4 border-yellow-100">
                        <Trophy className="w-24 h-24 text-yellow-500 mx-auto" />
                        <div>
                            <h2 className="text-3xl font-black text-gray-800 mb-2">연습 끝!</h2>
                            <p className="text-xl text-gray-600">
                                <span className="text-yellow-600 font-bold">{score}</span> / {words.length} 점
                            </p>
                        </div>

                        <button
                            onClick={() => setMode('list')}
                            className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            돌아가기
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
