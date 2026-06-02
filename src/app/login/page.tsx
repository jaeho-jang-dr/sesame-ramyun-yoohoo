"use client";

import { useAuthStore, loginWithGoogle, loginWithEmail, signUpWithEmail } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

export default function LoginPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                if (!name) throw new Error("이름을 입력해주세요.");
                await signUpWithEmail(email, password, name);
            }
            router.push('/');
        } catch (err) {
            console.error(err);
            const code = err instanceof FirebaseError ? err.code : "";
            if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
                setError("이메일이나 비밀번호가 틀렸어요.");
            } else if (code === 'auth/email-already-in-use') {
                setError("이미 가입된 이메일이에요.");
            } else if (code === 'auth/weak-password') {
                setError("비밀번호는 6자리 이상이어야 해요.");
            } else {
                setError("오류가 발생했어요. 다시 시도해주세요.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF7] p-4 text-gray-800">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">참깨라면 유후 <span className="text-purple-600">High</span></h1>
                    <p className="text-sm text-gray-500">
                        {isLogin ? '다시 만나서 반가워요!' : '새로운 친구가 되어주세요!'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        로그인
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        회원가입
                    </button>
                </div>

                {/* Email Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="이름 (친구들이 부를 닉네임)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                                required={!isLogin}
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="비밀번호 (6자리 이상)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                            required
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">
                            ⚠️ {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? '로그인하기' : '가입완료'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-white px-2 text-gray-400">또는</span>
                    </div>
                </div>

                {/* Google Login */}
                <button
                    onClick={() => loginWithGoogle()}
                    className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 p-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    {/* eslint-disable-next-line @next/next/no-img-element -- external icon, not worth next/image config */}
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="google logo" />
                    <span className="font-bold text-gray-700 text-sm">구글 계정으로 시작하기</span>
                </button>

                <p className="mt-8 text-center text-xs text-gray-400">
                    도움이 필요한가요? <span className="text-purple-600 underline cursor-pointer">문의하기</span>
                </p>
            </div>
        </div>
    );
}
