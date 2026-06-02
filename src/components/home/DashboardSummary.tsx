import { BookOpen, CheckCircle, DollarSign, Star } from "lucide-react";

export function DashboardSummary() {
    const stats = [
        { label: '읽은 책', value: '12권', icon: BookOpen, colorClass: 'text-blue-600 bg-blue-100' },
        { label: '남은 할 일', value: '3개', icon: CheckCircle, colorClass: 'text-green-600 bg-green-100' },
        { label: '모은 용돈', value: '5,000원', icon: DollarSign, colorClass: 'text-yellow-600 bg-yellow-100' },
        { label: '받은 칭찬', value: '8개', icon: Star, colorClass: 'text-pink-600 bg-pink-100' }
    ];

    return (
        <section className="cartoon-card bg-white p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    📊 나의 활동 요약
                </h2>
                <span className="text-xs bg-orange-100 text-orange-500 px-2.5 py-1 rounded-full font-bold">Today</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`${stat.colorClass} p-4 rounded-2xl border border-white/60 shadow-sm flex flex-col items-center justify-center text-center gap-1 transition-all duration-200 hover:-translate-y-1 hover:scale-105 hover:shadow-md`}>
                        <stat.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs text-gray-700 font-bold">{stat.label}</span>
                        <p className="text-lg font-black">{stat.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
