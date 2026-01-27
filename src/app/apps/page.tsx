"use client";

import Link from "next/link";
import { ArrowLeft, Brain, Rocket, Camera, ShoppingBag, ExternalLink } from "lucide-react";

export default function AppniversePage() {

    // 앱 목록 (URL을 실제 배포 주소로 변경해주세요)
    const apps = [
        {
            id: 'logic-math',
            name: '논리수학 퀴즈',
            desc: '재미있는 수학 퍼즐을 풀어보자!',
            icon: Brain,
            color: 'bg-yellow-400',
            textColor: 'text-yellow-900',
            url: 'https://haewan-logic-math-quiz.vercel.app', // 예상 URL
            isExternal: true
        },
        {
            id: 'hey-friends',
            name: '혜완 프렌즈',
            desc: '우리들의 추억 사진관',
            icon: Camera,
            color: 'bg-green-400',
            textColor: 'text-green-900',
            url: 'https://hey-friends-one.vercel.app', // 예상 URL
            isExternal: true
        },
        {
            id: 'bomnal',
            name: '봄날 쇼핑몰',
            desc: '프리미엄 쇼핑의 시작',
            icon: ShoppingBag,
            color: 'bg-pink-400',
            textColor: 'text-pink-900',
            url: 'https://bomnal-shopping-mall.vercel.app', // 예상 URL
            isExternal: true
        },
    ];

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white relative overflow-hidden">

            {/* Background Stars (CSS로 대체 가능하지만 간단하게 점으로 표현) */}
            <div className="absolute inset-0 opacity-20" style={{
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
                <div className="w-12"></div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto p-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                        모든 앱이 연결되는 곳,<br />
                        <span className="text-purple-400">혜완 유니버스</span>에 오신 것을 환영해요! 🪐
                    </h2>
                    <p className="text-slate-400 text-lg">원하는 앱으로 여행을 떠나볼까요?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map((app) => (
                        <a
                            key={app.id}
                            href={app.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative block"
                        >
                            <div className={`
                                absolute inset-0 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300
                                ${app.color}
                            `}></div>
                            <div className="relative bg-slate-800/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:-translate-y-2 hover:border-white/30 transition-all duration-300 h-full flex flex-col items-center text-center group-hover:bg-slate-800/80">

                                <div className={`w-20 h-20 rounded-2xl ${app.color} flex items-center justify-center mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}>
                                    <app.icon className={`w-10 h-10 ${app.textColor}`} />
                                </div>

                                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-300 transition-colors">{app.name}</h3>
                                <p className="text-slate-400 mb-6 flex-1">{app.desc}</p>

                                <div className="flex items-center gap-2 text-sm font-bold text-slate-300 group-hover:text-white transition-colors bg-white/5 py-2 px-4 rounded-full">
                                    <span>실행하기</span>
                                    <ExternalLink className="w-4 h-4" />
                                </div>
                            </div>
                        </a>
                    ))}

                    {/* Coming Soon Card */}
                    <div className="bg-slate-800/30 border border-dashed border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center min-h-[300px] hover:bg-slate-800/50 transition-colors">
                        <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 text-3xl">
                            🚀
                        </div>
                        <h3 className="text-xl font-bold text-slate-500 mb-2">새로운 앱 준비 중...</h3>
                        <p className="text-slate-600 text-sm">다음에 또 만나요!</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
