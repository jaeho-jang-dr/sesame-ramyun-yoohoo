"use client";

import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
    const { user, isAdmin, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            alert("관리자만 접근할 수 있습니다!");
            router.push('/');
        }
    }, [user, isAdmin, loading, router]);

    if (loading || !isAdmin) return <div className="min-h-screen flex items-center justify-center">로딩중...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="bg-white p-6 rounded-2xl shadow-sm mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-black text-gray-800">👑 혜완이네 관리자 페이지</h1>
                <div className="flex items-center gap-2">
                    <img src={user?.photoURL || ''} className="w-10 h-10 rounded-full border-2 border-purple-500" />
                    <span className="font-bold">{user?.displayName}님</span>
                </div>
            </header>

            <main className="grid gap-6 md:grid-cols-2">
                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">📊 방문자 게시판 관리</h2>
                    <div className="text-gray-400 py-10 text-center bg-gray-50 rounded-xl">
                        아직 게시글이 없습니다.
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">📱 앱 보관함 관리</h2>
                    <div className="text-gray-400 py-10 text-center bg-gray-50 rounded-xl">
                        등록된 앱이 없습니다.
                    </div>
                </div>
            </main>
        </div>
    );
}
