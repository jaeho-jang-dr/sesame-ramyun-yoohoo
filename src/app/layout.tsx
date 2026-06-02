import type { Metadata } from "next";
import { Jua } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

const jua = Jua({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "참깨라면 유후~",
  description: "혜완이의 즐거운 학교생활 도우미",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={jua.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
