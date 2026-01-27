"use client";

import { useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Not used
import { signInWithPopup, onAuthStateChanged, User, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    isAdmin: boolean;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const ADMIN_EMAILS = ['drjang00@gmail.com', '102030hohoho@gmail.com'];

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAdmin: false,
    setUser: (user) => set({
        user,
        isAdmin: user?.email ? ADMIN_EMAILS.includes(user.email) : false
    }),
    loading: true,
    setLoading: (loading) => set({ loading }),
}));

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [setUser, setLoading]);

    return <>{children} </>;
};

export const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
        console.error("Login failed", error);

        let message = `로그인 실패: ${error.message}`;

        if (error.code === 'auth/popup-closed-by-user') {
            message = "로그인 창을 닫으셨네요. 다시 시도해 주세요.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            return; // Ignore multiple popup requests
        } else if (error.code === 'auth/popup-blocked') {
            message = "브라우저가 팝업을 차단했습니다. 팝업 차단을 해제해 주세요.";
        } else if (error.code === 'auth/unauthorized-domain') {
            message = "현재 도메인(localhost 등)이 Firebase 승인된 도메인 목록에 없습니다. 콘솔을 확인하세요.";
        } else if (error.code === 'auth/network-request-failed') {
            message = "네트워크 연결을 확인해 주세요.";
        }

        alert(message);
    }
};

export const loginWithEmail = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error("Email Login failed", error);
        throw error; // Let the calling component handle this for UI feedback
    }
};

export const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: name
            });
            // Force update user state with new display name
            useAuthStore.getState().setUser({ ...userCredential.user, displayName: name });
        }
    } catch (error) {
        console.error("Signup failed", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed", error);
    }
};
