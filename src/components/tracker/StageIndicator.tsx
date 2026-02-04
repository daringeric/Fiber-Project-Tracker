"use client";

import { cn } from "@/lib/utils";
import { StageStatus, ProjectStage, STAGE_CONFIGS } from "@/types";
import {
  Construction,
  Cable,
  Router,
  Receipt,
  Headphones,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface StageIndicatorProps {
  stage: ProjectStage;
  status: StageStatus;
  isActive?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

const STAGE_ICONS: Record<ProjectStage, React.ComponentType<{ className?: string }>> = {
  [ProjectStage.OUTSIDE_PLANT]: Construction,
  [ProjectStage.FIBER_DELIVERY]: Cable,
  [ProjectStage.NETWORK_SETUP]: Router,
  [ProjectStage.RELEASE_TO_BILLING]: Receipt,
  [ProjectStage.FOLLOW_UP]: Headphones,
};

const SIZE_CLASSES = {
  sm: {
    container: "w-10 h-10",
    icon: "w-5 h-5",
    badge: "w-4 h-4 -top-1 -right-1",
    badgeIcon: "w-2.5 h-2.5",
  },
  md: {
    container: "w-14 h-14",
    icon: "w-7 h-7",
    badge: "w-5 h-5 -top-1 -right-1",
    badgeIcon: "w-3 h-3",
  },
  lg: {
    container: "w-16 h-16",
    icon: "w-8 h-8",
    badge: "w-6 h-6 -top-1 -right-1",
    badgeIcon: "w-3.5 h-3.5",
  },
};

export function StageIndicator({
  stage,
  status,
  isActive = false,
  onClick,
  size = "md",
}: StageIndicatorProps) {
  const Icon = STAGE_ICONS[stage];
  const config = STAGE_CONFIGS[stage];
  const sizeClasses = SIZE_CLASSES[size];

  const getStatusStyles = () => {
    switch (status) {
      case StageStatus.COMPLETED:
        return {
          container: "bg-success-500 border-success-500 text-white",
          badge: "bg-success-600",
          badgeIcon: Check,
        };
      case StageStatus.IN_PROGRESS:
        return {
          container: cn(
            "bg-accent-primary/10 border-accent-primary text-accent-primary",
            isActive && "animate-pulse-glow"
          ),
          badge: "bg-accent-primary",
          badgeIcon: Loader2,
        };
      case StageStatus.BLOCKED:
        return {
          container: "bg-error-50 border-error-500 text-error-500",
          badge: "bg-error-500",
          badgeIcon: AlertCircle,
        };
      default:
        return {
          container: "bg-gray-50 border-gray-300 text-gray-400",
          badge: null,
          badgeIcon: null,
        };
    }
  };

  const styles = getStatusStyles();
  const BadgeIcon = styles.badgeIcon;

  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={cn(
        "relative rounded-full border-2 flex items-center justify-center transition-all duration-300",
        sizeClasses.container,
        styles.container,
        onClick && "cursor-pointer hover:scale-110",
        !onClick && "cursor-default"
      )}
      title={config.name}
    >
      <Icon className={sizeClasses.icon} />

      {/* Status Badge */}
      {BadgeIcon && (
        <div
          className={cn(
            "absolute rounded-full flex items-center justify-center text-white",
            sizeClasses.badge,
            styles.badge
          )}
        >
          <BadgeIcon
            className={cn(
              sizeClasses.badgeIcon,
              status === StageStatus.IN_PROGRESS && "animate-spin"
            )}
          />
        </div>
      )}
    </button>
  );
}
