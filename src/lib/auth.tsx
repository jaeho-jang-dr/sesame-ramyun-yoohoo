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
    } catch (error) {
        console.error("Login failed", error);
        alert("로그인에 실패했습니다.");
    }
};

export const loginWithEmail = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error("Email Login failed", error);
        throw error;
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
