import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: LucideIcon;
  color?: "gold" | "pink" | "green";
  className?: string;
}

export default function IconBadge({ icon: Icon, color = "gold", className }: IconBadgeProps) {
  const colorStyles = {
    gold: "bg-sesame-gold/20 text-sesame-gold",
    pink: "bg-yoohoo-pink/20 text-yoohoo-pink",
    green: "bg-emerald-100 text-emerald-600",
  };

  return (
    <div className={cn("p-3 rounded-full w-fit flex items-center justify-center", colorStyles[color], className)}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
  );
}
