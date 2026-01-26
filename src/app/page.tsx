import Link from "next/link";
import { BookOpen, CheckCircle, DollarSign, Utensils, Star, Calendar, Edit3, Trash2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-lg p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-pink-500 mb-2 drop-shadow-sm">
            🌟 참깨라면 유후~ 🌟
          </h1>
          <p className="text-gray-600 font-medium text-lg">
            혜완이의 신나는 학교생활 도우미
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Dashboard Summary Cards */}
        <section className="bg-white rounded-3xl p-6 shadow-xl border-4 border-white/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-3xl">👋</span> 안녕, 혜완아!
            </h2>
            <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-bold">
              오늘도 화이팅!
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span className="font-bold text-gray-600">읽은 책</span>
              </div>
              <p className="text-3xl font-black text-blue-600">12<span className="text-base font-medium text-gray-500 ml-1">권</span></p>
            </div>

            <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-bold text-gray-600">할 일</span>
              </div>
              <p className="text-3xl font-black text-green-600">3<span className="text-base font-medium text-gray-500 ml-1">개 남음</span></p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-gray-600">용돈</span>
              </div>
              <p className="text-3xl font-black text-yellow-600">5,000<span className="text-base font-medium text-gray-500 ml-1">원</span></p>
            </div>

            <div className="bg-pink-50 p-4 rounded-2xl border-2 border-pink-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-pink-500" />
                <span className="font-bold text-gray-600">칭찬</span>
              </div>
              <p className="text-3xl font-black text-pink-600">8<span className="text-base font-medium text-gray-500 ml-1">개</span></p>
            </div>
          </div>
        </section>

        {/* Navigation Grid (Menu) */}
        <nav className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href="/school" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-blue-200 hover:border-blue-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <span className="text-3xl">📅</span>
            </div>
            <span className="text-xl font-bold text-gray-700">시간표</span>
          </Link>

          <Link href="/notices" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-green-200 hover:border-green-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <span className="text-3xl">📝</span>
            </div>
            <span className="text-xl font-bold text-gray-700">알림장</span>
          </Link>

          <Link href="/meals" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-orange-200 hover:border-orange-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
              <span className="text-3xl">🍱</span>
            </div>
            <span className="text-xl font-bold text-gray-700">급식 메뉴</span>
          </Link>

          <Link href="/dictation" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-yellow-200 hover:border-yellow-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
              <span className="text-3xl">✍️</span>
            </div>
            <span className="text-xl font-bold text-gray-700">받아쓰기</span>
          </Link>

          <Link href="/gugudan" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-red-200 hover:border-red-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <span className="text-3xl">🔢</span>
            </div>
            <span className="text-xl font-bold text-gray-700">구구단</span>
          </Link>

          <Link href="/books" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-pink-200 hover:border-pink-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
              <span className="text-3xl">📚</span>
            </div>
            <span className="text-xl font-bold text-gray-700">독서 기록</span>
          </Link>

          <Link href="/money" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-indigo-200 hover:border-indigo-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
              <span className="text-3xl">💰</span>
            </div>
            <span className="text-xl font-bold text-gray-700">용돈</span>
          </Link>

          <Link href="/cleaning" className="group bg-white p-6 rounded-3xl shadow-lg border-b-4 border-teal-200 hover:border-teal-400 hover:-translate-y-1 transition-all flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center group-hover:bg-teal-200 transition-colors">
              <span className="text-3xl">🧹</span>
            </div>
            <span className="text-xl font-bold text-gray-700">청소/심부름</span>
          </Link>
        </nav>
      </main>
    </div>
  );
}
