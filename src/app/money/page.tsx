"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useStore } from "@/store";

export default function MoneyPage() {
    const { money, savingsGoal, addMoneyTransaction, setSavingsGoal } = useStore();
    const [amount, setAmount] = useState("");
    const [memo, setMemo] = useState("");
    const [type, setType] = useState<'income' | 'expense'>('income');

    const total = money.reduce((acc, curr) => acc + (curr.type === 'income' ? curr.amount : -curr.amount), 0);

    const handleSubmit = () => {
        if (!amount) return;
        addMoneyTransaction({
            id: Date.now(),
            type,
            amount: parseInt(amount),
            memo,
            date: new Date().toLocaleDateString('ko-KR')
        });
        setAmount("");
        setMemo("");
    };

    return (
        <div className="min-h-screen bg-indigo-50 font-sans">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">💰 용돈 기입장</h1>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-6">
                {/* Balance Card with Savings Goal */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="opacity-80 font-medium mb-1">현재 남은 돈</p>
                        <p className="text-4xl font-black mb-4">{total.toLocaleString()}원</p>

                        {savingsGoal ? (
                            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-sm">🎯 목표: {savingsGoal.name}</span>
                                    <span className="text-xs">{Math.min(100, Math.round((total / savingsGoal.targetAmount) * 100))}% 달성</span>
                                </div>
                                <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="bg-yellow-400 h-full transition-all duration-500"
                                        style={{ width: `${Math.min(100, (total / savingsGoal.targetAmount) * 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs mt-1 opacity-70">
                                    <span>0원</span>
                                    <span>{savingsGoal.targetAmount.toLocaleString()}원</span>
                                </div>
                                <button
                                    onClick={() => setSavingsGoal(null)}
                                    className="text-xs mt-2 underline opacity-50 hover:opacity-100"
                                >
                                    목표 수정하기
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    const name = prompt("무엇을 사고 싶나요? (예: 닌텐도 게임)");
                                    if (!name) return;
                                    const amount = prompt("얼마가 필요한가요? (숫자만 입력)");
                                    if (!amount) return;
                                    setSavingsGoal({ name, targetAmount: parseInt(amount) });
                                }}
                                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                저축 목표 만들기
                            </button>
                        )}
                    </div>
                    <DollarSign className="absolute -right-6 -bottom-6 w-40 h-40 text-white/10 rotate-12" />
                </div>

                {/* Input Form */}
                <div className="bg-white p-5 rounded-2xl shadow-md border border-indigo-100">
                    <div className="flex mb-4 bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setType('income')}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex justify-center gap-2 ${type === 'income' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" /> 받음 (수입)
                        </button>
                        <button
                            onClick={() => setType('expense')}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all flex justify-center gap-2 ${type === 'expense' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:bg-gray-200'
                                }`}
                        >
                            <TrendingDown className="w-4 h-4" /> 씀 (지출)
                        </button>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="얼마인가요?"
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg font-bold"
                            />
                        </div>
                        <input
                            type="text"
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="내용 (예: 심부름 값, 과자 사먹음)"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                        <button
                            onClick={handleSubmit}
                            disabled={!amount}
                            className={`w-full py-3 text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 ${type === 'income' ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-red-500 hover:bg-red-600'
                                }`}
                        >
                            기록하기
                        </button>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-500 pl-2">최근 내역</h3>
                    {[...money].reverse().map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl flex justify-between items-center shadow-sm">
                            <div>
                                <p className="font-bold text-gray-800">{item.memo || (item.type === 'income' ? '용돈' : '지출')}</p>
                                <p className="text-xs text-gray-400">{item.date}</p>
                            </div>
                            <p className={`text-lg font-black ${item.type === 'income' ? 'text-indigo-600' : 'text-red-500'}`}>
                                {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
