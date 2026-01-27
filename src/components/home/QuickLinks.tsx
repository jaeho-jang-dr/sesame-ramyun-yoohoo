"use client";

import Link from "next/link";
import { LayoutGrid, Users, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function QuickLinks() {
    const [appCount, setAppCount] = useState<number | null>(null);

    useEffect(() => {
        // Real-time listener for app count
        const unsubscribe = onSnapshot(collection(db, "apps"), (snapshot) => {
            setAppCount(snapshot.size);
        });

        return () => unsubscribe();
    }, []);

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/apps" className="group bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-all hover:border-purple-200">
                <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-2.5 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <LayoutGrid className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-gray-800 text-sm">앱 스튜디오</h3>
                        <p className="text-xs text-gray-500">
                            내가 만든 앱 ({appCount !== null ? `${appCount}개` : '...'})
                        </p>
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
    );
}
