"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthStore, logout } from "@/lib/auth";
import { DashboardSummary } from "@/components/home/DashboardSummary";
import { QuickLinks } from "@/components/home/QuickLinks";
import { MainMenu } from "@/components/home/MainMenu";

export default function Home() {
  const { user, isAdmin } = useAuthStore();

  // 시간대에 따라 말풍선 메시지를 다르게 노출 (hydration 불일치 방지를 위해 마운트 후 설정)
  const [greeting, setGreeting] = useState("혜완아, 오늘도 유후~! 🍜");

  useEffect(() => {
    const hour = new Date().getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(
      hour >= 5 && hour < 12
        ? "혜완아, 좋은 아침! 오늘도 유후~! ☀️"
        : "혜완아, 오늘 학교 재미있었어? 🍜"
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] selection:bg-purple-100 text-gray-800">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(253, 224, 71, 0.2) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.2) 0%, transparent 20%)'
        }}>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              참깨라면 유후 <span className="text-purple-600 text-sm font-medium ml-1">High</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600 hidden sm:block">
                  {user.displayName}님
                </span>
                {isAdmin && (
                  <Link href="/admin" className="p-1.5 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                    <span className="text-xs font-bold text-purple-700">ADMIN</span>
                  </Link>
                )}
                <button onClick={logout} className="text-xs font-medium text-gray-500 hover:text-red-600 transition-colors">
                  로그아웃
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto p-6 space-y-8">
        {/* 마스코트 + 응원 말풍선 */}
        <section className="flex items-center gap-4 animate-pop-in">
          <div className="shrink-0 w-20 h-20 rounded-full bg-honey ring-4 ring-white shadow-sweet overflow-hidden flex items-center justify-center">
            <Image
              src="/images/mascot.png"
              alt="참깨라면 마스코트"
              width={80}
              height={80}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Speech Bubble (부드러운 파스텔 테마) */}
          <div className="relative bg-cream rounded-3xl px-5 py-3.5 shadow-sweet">
            {/* 말풍선 꼬리 */}
            <span className="absolute left-[-9px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[8px] border-y-transparent border-r-[13px] border-r-cream" />
            <p className="text-base md:text-lg font-bold text-gray-700 break-keep">
              {greeting}
            </p>
          </div>
        </section>

        <DashboardSummary />
        <QuickLinks />
        <MainMenu />
      </main>
    </div>
  );
}
