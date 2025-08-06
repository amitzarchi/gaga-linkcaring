import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconWithBadgeProps {
  icon: LucideIcon;
  badgeText?: string | number;
  badgeColor?: "default" | "yellow" | "red" | "green" | "blue" | "gray";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const badgeColorVariants = {
  default: "bg-gray-400 text-white",
  yellow: "bg-[#FFC53D] text-white",
  red: "bg-red-400 text-white", 
  green: "bg-lime-500 text-white",
  blue: "bg-blue-400 text-white",
  gray: "bg-gray-400 text-white",
};

const sizeVariants = {
  sm: {
    container: "h-8 w-8",
    icon: "h-4 w-4",
    badge: "h-4 w-4 text-sm min-w-4",
    badgePosition: "-top-1 -right-1",
  },
  md: {
    container: "h-12 w-12", 
    icon: "h-6 w-6",
    badge: "h-5 w-5 text-xs min-w-5",
    badgePosition: "-top-1.5 -right-1.5",
  },
  lg: {
    container: "size-24",
    icon: "size-10", 
    badge: "size-8 border-2 border-black/5 text-[17px] min-w-6",
    badgePosition: "-top-1 -right-1",
  },
};

export function IconWithBadge({ 
  icon: Icon, 
  badgeText, 
  badgeColor = "yellow",
  size = "lg",
  className 
}: IconWithBadgeProps) {
  const sizeConfig = sizeVariants[size];
  
  return (
    <div className={cn("relative inline-flex", className)}>
      <div className={cn(
        "rounded-full bg-gray-100 border-[0.5px] border-gray-300 ring-[0.5px] ring-gray-200 shadow-sm flex items-center justify-center",
        sizeConfig.container
      )}>
        <Icon className={cn("text-gray-400", sizeConfig.icon)} />
      </div>
      {badgeText !== undefined && (
        <div className={cn(
          "absolute rounded-full flex items-center justify-center font-medium animate-in zoom-in-50 duration-300 delay-0",
          badgeColorVariants[badgeColor],
          sizeConfig.badge,
          sizeConfig.badgePosition
        )}>
          {badgeText}
        </div>
      )}
    </div>
  );
}