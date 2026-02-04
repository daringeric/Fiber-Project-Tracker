import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

export function Logo({
  className,
  variant = "full",
  theme = "dark",
  size = "md"
}: LogoProps) {
  // Lightcurve brand colors
  const textColor = theme === "dark" ? "text-white" : "text-navy-900";
  const waveColor = "#00A2AD"; // Wave
  const violettaColor = "#BD137A"; // Violetta
  const navyColor = theme === "dark" ? "#FFFFFF" : "#0E0A49";

  const sizeClasses = {
    sm: { icon: "w-8 h-8", text: "text-lg", subtext: "text-[10px]" },
    md: { icon: "w-10 h-10", text: "text-xl", subtext: "text-xs" },
    lg: { icon: "w-12 h-12", text: "text-2xl", subtext: "text-sm" },
  };

  const IconSVG = ({ iconClassName }: { iconClassName?: string }) => (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size].icon, iconClassName)}
    >
      {/* Outer ring - Navy/White */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke={navyColor}
        strokeWidth="2"
        fill="none"
      />

      {/* Wave curve - representing the "light curve" */}
      <path
        d="M6 20C6 20 10 10 20 10C30 10 34 20 34 20"
        stroke={waveColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Violetta accent curve */}
      <path
        d="M10 24C10 24 14 30 20 30C26 30 30 24 30 24"
        stroke={violettaColor}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Center fiber point - Wave */}
      <circle cx="20" cy="20" r="4" fill={waveColor} />
      <circle cx="20" cy="20" r="2" fill="white" />

      {/* Light rays emanating from center */}
      <g opacity="0.6">
        <path
          d="M20 8V4"
          stroke={waveColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M28 12L31 9"
          stroke={violettaColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 12L9 9"
          stroke={waveColor}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );

  if (variant === "icon") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <IconSVG />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <IconSVG />
      <div className="flex flex-col">
        <span className={cn("font-bold tracking-tight", sizeClasses[size].text, textColor)}>
          Light<span className="text-wave-500">curve</span>
        </span>
        <span className={cn(
          "tracking-wider uppercase",
          sizeClasses[size].subtext,
          theme === "dark" ? "text-white/70" : "text-navy-500"
        )}>
          Fiber Tracker
        </span>
      </div>
    </div>
  );
}
