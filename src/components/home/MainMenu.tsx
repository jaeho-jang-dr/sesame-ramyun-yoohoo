import Link from "next/link";
import { Calendar, Bell, Utensils, Pencil, Brain, Book, Wallet, Brush } from "lucide-react";

export function MainMenu() {
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
    );
}
