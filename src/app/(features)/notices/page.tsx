import Notices from "@/components/features/Notices";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NoticesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <header className="flex items-center mb-8">
          <Link 
            href="/" 
            className="bg-white/80 p-3 rounded-full hover:bg-white hover:scale-110 transition-all shadow-md mr-4"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </Link>
          <h1 className="text-4xl font-black text-white drop-shadow-md">
            알림장
          </h1>
        </header>

        <main>
          <Notices />
        </main>
      </div>
    </div>
  );
}
