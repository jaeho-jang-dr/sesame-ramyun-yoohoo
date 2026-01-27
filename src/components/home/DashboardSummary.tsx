import { BookOpen, CheckCircle, DollarSign, Star } from "lucide-react";

export function DashboardSummary() {
    const stats = [
        { label: '읽은 책', value: '12권', icon: BookOpen, colorClass: 'text-blue-600 bg-blue-50' },
        { label: '남은 할 일', value: '3개', icon: CheckCircle, colorClass: 'text-green-600 bg-green-50' },
        { label: '모은 용돈', value: '5,000원', icon: DollarSign, colorClass: 'text-yellow-600 bg-yellow-50' },
        { label: '받은 칭찬', value: '8개', icon: Star, colorClass: 'text-pink-600 bg-pink-50' }
    ];

    return (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200/60">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    📊 나의 활동 요약
                </h2>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-md font-medium">Today</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`${stat.colorClass} bg-opacity-50 p-4 rounded-xl border border-transparent hover:border-black/5 transition-colors flex flex-col items-center justify-center text-center gap-1`}>
                        <stat.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs text-gray-600 font-medium">{stat.label}</span>
                        <p className="text-lg font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
