"use client";

import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function GuestbookPage() {
    return (
        <div className="min-h-screen bg-green-50 p-6 flex items-center justify-center">
            <h1 className="text-3xl font-bold text-green-700">📝 방문자 게시판 (준비중)</h1>
        </div>
    );
}
