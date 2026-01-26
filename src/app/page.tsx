"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, DollarSign, Star, LayoutGrid, Users, ChevronRight, Calendar, Bell, Utensils, Pencil, Brain, Book, Wallet, Brush } from "lucide-react";
import { useAuthStore, logout } from "@/lib/auth";

export default function Home() {
  const { user, isAdmin } = useAuthStore();

  const menuItems = [
    { href: "/school", icon: Calendar, label: "시간표", colorClass: "bg-blue-50 text-blue-600", desc: "이번 주 수업" },
    { href: "/notices", icon: Bell, label: "알림장", colorClass: "bg-green-50 text-green-600", desc: "학교 소식" },
    { href: "/meals", icon: Utensils, label: "급식 메뉴", colorClass: "bg-orange-50 text-orange-600", desc: "오늘 뭐 먹지?" },
    { href: "/dictation", icon: Pencil, label: "받아쓰기", colorClass: "bg-yellow-50 text-yellow-600", desc: "맞춤법 연습" },
    { href: "/gugudan", icon: Brain, label: "구구단", colorClass: "bg-red-50 text-red-600", desc: "수학 두뇌" },
    { href: "/books", icon: Book, label: "독서 기록", colorClass: "bg-pink-50 text-pink-600", desc: "마음의 양식" },
    { href: "/money", icon: Wallet, label: "용돈 기입장", colorClass: "bg-indigo-50 text-indigo-600", desc: "똑똑한 소비" },
    { href: "/cleaning", icon: Brush, label: "청소/심부름", colorClass: "bg-teal-50 text-teal-600", desc: "나의 역할" },
  ];

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

        {/* Dashboard Summary - Compact & Clean */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              📊 나의 활동 요약
            </h2>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium">Today</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '읽은 책', value: '12권', icon: BookOpen, colorClass: 'text-blue-600 bg-blue-50' },
              { label: '남은 할 일', value: '3개', icon: CheckCircle, colorClass: 'text-green-600 bg-green-50' },
              { label: '모은 용돈', value: '5,000원', icon: DollarSign, colorClass: 'text-yellow-600 bg-yellow-50' },
              { label: '받은 칭찬', value: '8개', icon: Star, colorClass: 'text-pink-600 bg-pink-50' }
            ].map((stat, i) => (
              <div key={i} className={`${stat.colorClass} bg-opacity-50 p-4 rounded-xl border border-transparent hover:border-black/5 transition-colors flex flex-col items-center justify-center text-center gap-1`}>
                <stat.icon className="w-5 h-5 mb-1" />
                <span className="text-xs text-gray-600 font-medium">{stat.label}</span>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links: App Board & Guestbook (Smaller, Side-by-Side) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/apps" className="group bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all hover:border-purple-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-2.5 rounded-lg group-hover:bg-purple-200 transition-colors">
                <LayoutGrid className="w-5 h-5 text-purple-700" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-sm">앱 스튜디오</h3>
                <p className="text-xs text-gray-500">내가 만든 앱 (3개)</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
          </Link>

          <Link href="/guestbook" className="group bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all hover:border-green-200">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-2.5 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="w-5 h-5 text-green-700" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-sm">커뮤니티</h3>
                <p className="text-xs text-gray-500">친구들 방명록</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 transition-colors" />
          </Link>
        </section>

        {/* Main Menu Grid - Professional & Clean */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">바로가기</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {menuItems.map((item, index) => (
              <Link href={item.href} key={index} className="group relative">
                <div className={`
                  bg-white p-5 rounded-xl border border-gray-200 shadow-sm
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
                  flex flex-col items-center text-center h-full
                `}>
                  <div className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center mb-3
                    ${item.colorClass} group-hover:scale-110 transition-transform duration-200
                  `}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-800 mb-1">{item.label}</h3>
                  <p className="text-xs text-gray-400 group-hover:text-gray-500 transition-colors line-clamp-1">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
