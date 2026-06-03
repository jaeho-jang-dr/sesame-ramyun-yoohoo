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
            <Link href="/apps" className="cartoon-card cartoon-pop group bg-purple-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm">
                        <LayoutGrid className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-black text-gray-900 text-lg">앱 스튜디오</h3>
                        <p className="text-sm text-gray-700 font-bold">
                            내가 만든 앱 ({appCount !== null ? `${appCount}개` : '...'})
                        </p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link href="/guestbook" className="cartoon-card cartoon-pop group bg-green-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm">
                        <Users className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-black text-gray-900 text-lg">커뮤니티</h3>
                        <p className="text-sm text-gray-700 font-bold">친구들 방명록</p>
                    </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:translate-x-1 transition-transform" />
            </Link>
        </section>
    );
}
