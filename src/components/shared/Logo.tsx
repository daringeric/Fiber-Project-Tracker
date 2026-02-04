import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  theme?: "light" | "dark";
}

export function Logo({ className, variant = "full", theme = "dark" }: LogoProps) {
  const textColor = theme === "dark" ? "text-white" : "text-navy-700";
  const accentColor = "text-accent-primary";

  if (variant === "icon") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Fiber optic representation */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="2"
            className={textColor}
          />
          <path
            d="M12 20C12 20 16 12 20 12C24 12 28 20 28 20C28 20 24 28 20 28C16 28 12 20 12 20Z"
            stroke="currentColor"
            strokeWidth="2"
            className={accentColor}
          />
          <circle cx="20" cy="20" r="3" fill="currentColor" className={accentColor} />
          {/* Light rays */}
          <path
            d="M20 8V4M20 36V32M32 20H36M4 20H8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className={accentColor}
            opacity="0.5"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fiber optic representation */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          className={textColor}
        />
        <path
          d="M12 20C12 20 16 12 20 12C24 12 28 20 28 20C28 20 24 28 20 28C16 28 12 20 12 20Z"
          stroke="currentColor"
          strokeWidth="2"
          className={accentColor}
        />
        <circle cx="20" cy="20" r="3" fill="currentColor" className={accentColor} />
        {/* Light rays */}
        <path
          d="M20 8V4M20 36V32M32 20H36M4 20H8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className={accentColor}
          opacity="0.5"
        />
      </svg>
      <div className="flex flex-col">
        <span className={cn("text-xl font-bold tracking-tight", textColor)}>
          Light<span className={accentColor}>Curve</span>
        </span>
        <span className={cn("text-xs tracking-wider uppercase opacity-70", textColor)}>
          Fiber Tracker
        </span>
      </div>
    </div>
  );
}
