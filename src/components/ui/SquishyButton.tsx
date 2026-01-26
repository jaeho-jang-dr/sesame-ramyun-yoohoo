"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SquishyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "gold" | "pink" | "green";
  className?: string;
}

export default function SquishyButton({
  children,
  onClick,
  variant = "gold",
  className,
}: SquishyButtonProps) {
  const variants = {
    gold: "bg-sesame-gold text-white hover:bg-sesame-gold/90",
    pink: "bg-yoohoo-pink text-white hover:bg-yoohoo-pink/90",
    green: "bg-emerald-500 text-white hover:bg-emerald-600",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onClick={onClick}
      className={cn(
        "px-6 py-3 rounded-xl font-bold shadow-md transition-colors outline-none focus:ring-2 focus:ring-offset-2",
        variant === "gold" && "focus:ring-sesame-gold",
        variant === "pink" && "focus:ring-yoohoo-pink",
        variant === "green" && "focus:ring-emerald-500",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
}
