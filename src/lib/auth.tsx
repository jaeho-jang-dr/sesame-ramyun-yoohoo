"use client";

import { useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Not used
import { signInWithPopup, onAuthStateChanged, User, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    isAdmin: boolean;
    setUser: (user: User | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const ADMIN_EMAILS = ['drjang00@gmail.com', '102030hohoho@gmail.com', 'hwkim2571@gmail.com'];

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

// 로그인 시 /users/{uid}에 프로필을 동기화하고, 차단 여부를 반환한다.
const syncUserProfile = async (user: User): Promise<boolean> => {
    const userRef = doc(db, "users", user.uid);
    const isAdminEmail = user.email ? ADMIN_EMAILS.includes(user.email) : false;
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        // 신규 가입자: 프로필 문서 생성
        await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName || "익명",
            email: user.email || "",
            photoURL: user.photoURL || "",
            role: isAdminEmail ? "admin" : "user",
            isBanned: false,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
        });
        return false;
    }

    const data = snap.data();
    if (data.isBanned === true) {
        return true; // 차단된 계정
    }

    // 기존 가입자: 프로필 변경분 동기화(권한/차단 필드는 건드리지 않음)
    await setDoc(
        userRef,
        {
            displayName: user.displayName || data.displayName || "익명",
            email: user.email || data.email || "",
            photoURL: user.photoURL || data.photoURL || "",
            lastLogin: serverTimestamp(),
        },
        { merge: true }
    );
    return false;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        let unsubUserDoc: (() => void) | null = null;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            // 이전 사용자 문서 리스너 정리
            if (unsubUserDoc) {
                unsubUserDoc();
                unsubUserDoc = null;
            }

            if (!user) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const banned = await syncUserProfile(user);
                if (banned) {
                    alert("차단된 계정입니다. 관리자에게 문의하세요.");
                    await signOut(auth);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                setUser(user);
                setLoading(false);

                // 로그인 중 차단되면 실시간으로 감지해 강제 로그아웃
                unsubUserDoc = onSnapshot(doc(db, "users", user.uid), (d) => {
                    if (d.exists() && d.data().isBanned === true) {
                        alert("계정이 차단되어 로그아웃됩니다.");
                        signOut(auth);
                    }
                });
            } catch (error) {
                console.error("User profile sync failed", error);
                // 동기화 실패 시에도 로그인 자체는 유지(앱 사용 가능)
                setUser(user);
                setLoading(false);
            }
        });

        return () => {
            if (unsubUserDoc) unsubUserDoc();
            unsubscribe();
        };
    }, [setUser, setLoading]);

    return <>{children} </>;
};

export const loginWithGoogle = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Login failed", error);

        const code = error instanceof FirebaseError ? error.code : "";
        const detail = error instanceof Error ? error.message : String(error);
        let message = `로그인 실패: ${detail}`;

        if (code === 'auth/popup-closed-by-user') {
            message = "로그인 창을 닫으셨네요. 다시 시도해 주세요.";
        } else if (code === 'auth/cancelled-popup-request') {
            return; // Ignore multiple popup requests
        } else if (code === 'auth/popup-blocked') {
            message = "브라우저가 팝업을 차단했습니다. 팝업 차단을 해제해 주세요.";
        } else if (code === 'auth/unauthorized-domain') {
            message = "현재 도메인(localhost 등)이 Firebase 승인된 도메인 목록에 없습니다. 콘솔을 확인하세요.";
        } else if (code === 'auth/network-request-failed') {
            message = "네트워크 연결을 확인해 주세요.";
        }

        alert(message);
    }
};

export const loginWithEmail = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
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
