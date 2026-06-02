"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSchoolStore } from "@/store/useSchoolStore";
import BentoCard from "@/components/ui/BentoCard";
import SquishyButton from "@/components/ui/SquishyButton";
import { Trash2, Plus, BookOpen, Sparkles } from "lucide-react";

const DAYS = ["월요일", "화요일", "수요일", "목요일", "금요일"];

export default function Timetable() {
  const { timetable, addSubject, removeSubject } = useSchoolStore();
  const [selectedDay, setSelectedDay] = useState("월요일");
  const [subject, setSubject] = useState("");
  const [items, setItems] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration guard
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  const handleAddSubject = () => {
    if (!subject.trim()) return;
    addSubject(selectedDay, subject, items);
    setSubject("");
    setItems("");
  };

  const currentSubjects = timetable[selectedDay] || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Day Selection Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`
              relative px-4 py-2 rounded-full text-lg font-bold transition-all duration-300
              ${
                selectedDay === day
                  ? "text-white shadow-lg scale-110"
                  : "bg-white text-gray-400 hover:bg-gray-50"
              }
            `}
          >
            {selectedDay === day && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-sesame-gold rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{day}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timetable Display */}
        <BentoCard className="min-h-[400px] bg-gradient-to-br from-white to-orange-50 border-orange-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-sesame-gold/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-sesame-gold" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedDay} 시간표
            </h2>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {currentSubjects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center py-12 text-gray-400"
                >
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>아직 등록된 수업이 없어요!</p>
                </motion.div>
              ) : (
                currentSubjects.map((item, index) => (
                  <motion.div
                    key={`${selectedDay}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center bg-sesame-gold text-white font-bold rounded-full text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {item.subject}
                        </h3>
                        {item.items && (
                          <p className="text-sm text-gray-500 mt-0.5">
                            준비물: {item.items}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeSubject(selectedDay, index)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </BentoCard>

        {/* Add Subject Form */}
        <BentoCard className="h-fit bg-gradient-to-br from-white to-pink-50 border-pink-100">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-yoohoo-pink/20 rounded-xl">
              <Plus className="w-6 h-6 text-yoohoo-pink" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">수업 추가하기</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                과목 이름
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="예: 국어, 수학, 즐거운 생활"
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-yoohoo-pink focus:outline-none transition-colors bg-white/50"
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2 ml-1">
                준비물 (선택)
              </label>
              <input
                type="text"
                value={items}
                onChange={(e) => setItems(e.target.value)}
                placeholder="예: 교과서, 색연필"
                className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-yoohoo-pink focus:outline-none transition-colors bg-white/50"
                onKeyDown={(e) => e.key === "Enter" && handleAddSubject()}
              />
            </div>

            <div className="pt-4">
              <SquishyButton
                onClick={handleAddSubject}
                variant="pink"
                className="w-full flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                추가하기
              </SquishyButton>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/60 rounded-xl text-sm text-gray-500">
            <p className="flex items-center gap-2">
              <span className="text-xl">💡</span>
              <span>
                <strong>팁:</strong> 수업을 삭제하려면 목록에서 마우스를 올려보세요!
              </span>
            </p>
          </div>
        </BentoCard>
      </div>
    </div>
  );
}
