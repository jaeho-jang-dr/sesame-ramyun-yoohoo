"use client";

import { useState, useEffect } from "react";
import { useSchoolStore } from "@/store/useSchoolStore";
import SquishyButton from "@/components/ui/SquishyButton";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Plus, Trash2, CheckCircle2, Circle, Pin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notices() {
  const { notices, addNotice, toggleNotice, removeNotice } = useSchoolStore();
  const [newNotice, setNewNotice] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddNotice = () => {
    if (!newNotice.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    addNotice(newNotice, today);
    setNewNotice("");
  };

  const handleToggleNotice = (id: number, done: boolean) => {
    toggleNotice(id);
    if (!done) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FF69B4", "#00CED1"], // Gold, Pink, Turquoise
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddNotice();
    }
  };

  if (!mounted) return null;

  // Sort notices: pending first, then completed
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.done === b.done) return b.id - a.id; // Newest first
    return a.done ? 1 : -1;
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Input Section */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg border-2 border-sesame-gold/20">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span className="text-3xl">📢</span> 알림장 쓰기
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="내일 준비물이나 숙제를 적어보세요!"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sesame-gold focus:ring-2 focus:ring-sesame-gold/20 outline-none transition-all text-lg"
          />
          <SquishyButton onClick={handleAddNotice} variant="gold">
            <Plus className="w-6 h-6" />
          </SquishyButton>
        </div>
      </div>

      {/* Corkboard Area */}
      <div className="bg-[#E8DCCA] p-6 rounded-3xl shadow-inner min-h-[400px] relative overflow-hidden">
        {/* Cork texture pattern overlay (optional, using CSS for simplicity) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {sortedNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500/60">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl font-medium">아직 알림장이 없어요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            <AnimatePresence mode="popLayout">
              {sortedNotices.map((notice) => (
                <motion.div
                  key={notice.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  className={cn(
                    "relative p-6 min-h-[180px] flex flex-col justify-between shadow-lg transition-colors duration-300",
                    "before:content-[''] before:absolute before:top-[-12px] before:left-1/2 before:-translate-x-1/2 before:w-4 before:h-4 before:rounded-full before:shadow-sm before:z-20",
                    notice.done 
                      ? "bg-gray-100 text-gray-400 rotate-1" 
                      : "bg-[#FFF9C4] text-gray-800 -rotate-1 hover:rotate-0", // Sticky note yellow
                    notice.id % 3 === 0 ? "before:bg-red-400" : notice.id % 3 === 1 ? "before:bg-blue-400" : "before:bg-green-400" // Pin colors
                  )}
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%)" // Dog-ear effect
                  }}
                >
                  {/* Pin Icon (Visual only, replaced by CSS pseudo-element for better look, but keeping icon for backup) */}
                  {/* <Pin className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 text-red-500 fill-red-500 drop-shadow-md" /> */}

                  <div className="mb-4">
                    <p className={cn(
                      "text-lg font-medium leading-relaxed font-handwriting", // Assuming a handwriting font might be added later, or just standard
                      notice.done && "line-through decoration-2 decoration-gray-300"
                    )}>
                      {notice.text}
                    </p>
                    <p className="text-xs mt-2 opacity-60 font-mono">
                      {notice.date}
                    </p>
                  </div>

                  <div className="flex justify-between items-end pt-4 border-t border-black/5">
                    <button
                      onClick={() => handleToggleNotice(notice.id, notice.done)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        notice.done 
                          ? "text-emerald-500 hover:bg-emerald-50" 
                          : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
                      )}
                    >
                      {notice.done ? (
                        <CheckCircle2 className="w-8 h-8" />
                      ) : (
                        <Circle className="w-8 h-8" />
                      )}
                    </button>

                    <button
                      onClick={() => removeNotice(notice.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Folded corner visual */}
                  <div className="absolute bottom-0 right-0 w-5 h-5 bg-black/5" 
                       style={{ 
                         clipPath: "polygon(0 0, 0 100%, 100% 0)",
                         background: "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)"
                       }} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
