import { FileSearch, LucideIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  className = "",
}) => {
  const Icon = icon || FileSearch
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[400px] w-full p-8 gsap-reveal", className)}>
      {Icon && (
        <div className="relative group mb-8">
           <div className="absolute inset-0 bg-accent-purple/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
           <div className="size-20 bg-secondary/30 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center justify-center relative z-10 shadow-inner">
             <Icon className="size-8 text-accent animate-pulse" />
           </div>
        </div>
      )}
      <h3 className="text-xl font-black text-foreground mb-2 uppercase tracking-tighter">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground font-medium max-w-[280px] text-center mb-8 opacity-60 leading-relaxed">
        {description}
      </p>
      <div className="h-1.5 w-12 bg-gradient-to-r from-accent to-accent-purple rounded-full opacity-40" />
    </div>
  );
};
