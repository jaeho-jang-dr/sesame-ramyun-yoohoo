import { cn } from "@/lib/utils";

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function BentoCard({ children, className }: BentoCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}
