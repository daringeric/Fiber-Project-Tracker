// ============================================
// Email Configuration
// ============================================

export interface EmailConfig {
  provider: "resend" | "sendgrid" | "smtp" | "mock";
  from: string;
  replyTo: string;
  baseUrl: string;
  companyName: string;
  supportEmail: string;
  supportPhone: string;
}

export const emailConfig: EmailConfig = {
  provider: (process.env.EMAIL_PROVIDER as EmailConfig["provider"]) || "mock",
  from: process.env.EMAIL_FROM || "notifications@lightcurve.com",
  replyTo: process.env.EMAIL_REPLY_TO || "support@lightcurve.com",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  companyName: "Lightcurve",
  supportEmail: "support@lightcurve.com",
  supportPhone: "1-800-555-0123",
};

// Brand colors for emails
export const emailColors = {
  navy: "#0E0A49",
  wave: "#00A2AD",
  violetta: "#BD137A",
  charcoal: "#1D1D1D",
  white: "#FFFFFF",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    500: "#6B7280",
    700: "#374151",
    900: "#111827",
  },
};

// Email template types
export type EmailTemplate =
  | "welcome"
  | "stage-update"
  | "completed"
  | "feedback"
  | "blocker-notification"
  | "custom";

export interface EmailTemplateData {
  customerName: string;
  trackingCode: string;
  trackingUrl: string;
  projectId?: string;
  stageName?: string;
  stageDescription?: string;
  progress?: number;
  customSubject?: string;
  customBody?: string;
}

// Email subject lines
export const emailSubjects: Record<EmailTemplate, (data: EmailTemplateData) => string> = {
  welcome: () => "Welcome to Lightcurve - Your Fiber Project Has Started",
  "stage-update": (data) => `Your Fiber Installation Update: ${data.stageName} In Progress`,
  completed: () => "Congratulations! Your Fiber Installation is Complete",
  feedback: () => "How Was Your Experience? Quick Survey",
  "blocker-notification": () => "Update on Your Fiber Installation",
  custom: (data) => data.customSubject || "Update from Lightcurve",
};
