"use client";

import Link from "next/link";
import { useAuthStore, logout } from "@/lib/auth";
import { DashboardSummary } from "@/components/home/DashboardSummary";
import { QuickLinks } from "@/components/home/QuickLinks";
import { MainMenu } from "@/components/home/MainMenu";

export default function Home() {
  const { user, isAdmin } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-purple-100 text-gray-800">
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
        <DashboardSummary />
        <QuickLinks />
        <MainMenu />
      </main>
    </div>
  );
}
