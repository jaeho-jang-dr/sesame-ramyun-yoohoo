"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { useStore } from "@/store";

export default function GugudanPage() {
    const { gugudanStats, updateGugudanStats } = useStore();
    const [num1, setNum1] = useState(2);
    const [num2, setNum2] = useState(1);
    const [answer, setAnswer] = useState("");
    const [combo, setCombo] = useState(0);
    const [message, setMessage] = useState("문제를 풀어볼까요?");
    const [messageColor, setMessageColor] = useState("text-gray-500");

    const [mode, setMode] = useState<'practice' | 'challenge'>('practice');
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    setIsActive(false);
                    setMode('practice');
                    alert(`시간 종료! ⏰ 최종 점수: ${combo}점`);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isActive, combo]);

    const startChallenge = () => {
        setMode('challenge');
        setTimeLeft(60);
        setCombo(0);
        setIsActive(true);
        generateProblem();
        setMessage("시작! 최대한 많이 맞추세요! 🔥");
    };

    const generateProblem = () => {
        setNum1(Math.floor(Math.random() * 8) + 2); // 2~9
        setNum2(Math.floor(Math.random() * 9) + 1); // 1~9
        setAnswer("");
    };

    useEffect(() => {
        generateProblem();
    }, []);

    const checkAnswer = () => {
        const val = parseInt(answer);
        const correctAnswer = num1 * num2;

        if (val === correctAnswer) {
            // Correct
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#EF4444', '#F59E0B'] // Red & Amber
            });
            setMessage("정답입니다! 참 잘했어요! 🎉");
            setMessageColor("text-red-500");
            setCombo(c => c + 1);
            updateGugudanStats(true, combo + 1);
            generateProblem();
        } else {
            // Wrong
            if (mode === 'challenge') {
                setMessage(`땡! 틀렸어요. ${timeLeft}초 남았어요!`);
            } else {
                setMessage(`땡! 정답은 ${correctAnswer} 입니다. 다시 해볼까요?`);
            }
            setMessageColor("text-blue-500");
            if (mode === 'practice') setCombo(0);
            updateGugudanStats(false, gugudanStats.highScore);
            setAnswer("");
        }
    };

    return (
        <div className="min-h-screen bg-red-50 font-sans">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-gray-700" />
                </Link>
                <h1 className="text-xl font-bold text-gray-800">🔢 구구단 놀이</h1>
            </header>

            <main className="max-w-md mx-auto p-4 flex flex-col items-center py-6">

                {/* Challenge Banner */}
                {mode === 'practice' ? (
                    <div className="w-full bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-2xl text-white flex justify-between items-center mb-6 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer" onClick={startChallenge}>
                        <div>
                            <p className="font-bold text-lg">🔥 도전 모드</p>
                            <p className="text-white/80 text-sm">60초 동안 얼마나 맞출 수 있을까?</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                    </div>
                ) : (
                    <div className="w-full bg-red-600 p-4 rounded-2xl text-white text-center mb-6 animate-pulse">
                        <p className="text-3xl font-black">{timeLeft}초</p>
                    </div>
                )}

                {/* Score Board */}
                <div className="flex gap-4 w-full mb-8">
                    <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm text-center border border-red-100">
                        <p className="text-sm text-gray-500 font-bold">최고 기록</p>
                        <p className="text-2xl font-black text-purple-600">🏆 {gugudanStats.highScore}</p>
                    </div>
                    <div className="flex-1 bg-yellow-100 p-4 rounded-2xl shadow-sm text-center border border-yellow-200">
                        <p className="text-sm text-yellow-700 font-bold">현재 콤보</p>
                        <p className="text-2xl font-black text-yellow-600">🔥 {combo}</p>
                    </div>
                </div>

                {/* Problem Card */}
                <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-xl p-8 border-4 border-red-100 text-center mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-4 bg-red-400"></div>

                    <div className="text-7xl font-black text-gray-800 flex items-center justify-center gap-4 mb-8 font-mono tracking-tighter">
                        <span>{num1}</span>
                        <span className="text-red-400">×</span>
                        <span>{num2}</span>
                    </div>

                    <div className="relative">
                        <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && answer && checkAnswer()}
                            placeholder="?"
                            className="w-full h-20 text-center text-4xl font-black bg-gray-50 border-2 border-red-100 rounded-2xl focus:outline-none focus:border-red-400 focus:bg-white transition-all caret-red-500"
                            autoFocus
                        />
                    </div>
                </div>

                <p className={`text-lg font-bold mb-6 min-h-[1.75rem] ${messageColor}`}>{message}</p>

                <button
                    onClick={checkAnswer}
                    disabled={!answer}
                    className="w-full max-w-sm py-4 bg-red-500 text-white text-xl font-bold rounded-2xl shadow-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed active:translate-y-1 transition-all"
                >
                    정답 확인! 🚀
                </button>

            </main>
        </div>
    );
}
