// ============================================
// Email Sending Service
// ============================================

import { Project, ProjectStage, STAGE_CONFIGS } from "@/types";
import { emailConfig, emailSubjects, EmailTemplate, EmailTemplateData } from "./config";
import { renderWelcomeEmail, WelcomeEmailData } from "./templates/welcome-email";
import { renderStageUpdateEmail, StageUpdateEmailData } from "./templates/stage-update-email";
import { renderCompletedEmail, CompletedEmailData } from "./templates/completed-email";
import { getWeightedProgress } from "../workflow/stage-workflow";

// ============================================
// Types
// ============================================

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailLogEntry {
  id: string;
  projectId: string;
  template: EmailTemplate;
  to: string;
  subject: string;
  sentAt: Date;
  status: "sent" | "failed" | "pending";
  error?: string;
  messageId?: string;
}

// In-memory email log for mock implementation
const emailLog: EmailLogEntry[] = [];

// ============================================
// Email Rendering
// ============================================

function formatAddress(project: Project): string {
  const addr = project.address;
  let address = addr.street;
  if (addr.unit) address += ` ${addr.unit}`;
  address += `, ${addr.city}, ${addr.state} ${addr.zipCode}`;
  return address;
}

function getStageProgressInfo(project: Project): {
  completedStages: string[];
  currentStage: string;
  remainingStages: string[];
} {
  const allStages = Object.values(ProjectStage);
  const currentIndex = allStages.indexOf(project.currentStage);

  const completedStages = allStages
    .slice(0, currentIndex)
    .map((s) => STAGE_CONFIGS[s].name);

  const currentStage = STAGE_CONFIGS[project.currentStage].name;

  const remainingStages = allStages
    .slice(currentIndex + 1)
    .map((s) => STAGE_CONFIGS[s].name);

  return { completedStages, currentStage, remainingStages };
}

export function renderEmailTemplate(
  template: EmailTemplate,
  project: Project
): string {
  const trackingUrl = `${emailConfig.baseUrl}/track/${project.trackingCode}`;

  switch (template) {
    case "welcome": {
      const data: WelcomeEmailData = {
        customerName: project.customerName,
        trackingCode: project.trackingCode,
        trackingUrl,
        serviceAddress: formatAddress(project),
        serviceType: project.serviceType,
      };
      return renderWelcomeEmail(data);
    }

    case "stage-update": {
      const stageInfo = getStageProgressInfo(project);
      const config = STAGE_CONFIGS[project.currentStage];
      const data: StageUpdateEmailData = {
        customerName: project.customerName,
        trackingCode: project.trackingCode,
        trackingUrl,
        stageName: config.name,
        stageDescription: config.description,
        progress: getWeightedProgress(project),
        ...stageInfo,
      };
      return renderStageUpdateEmail(data);
    }

    case "completed": {
      const data: CompletedEmailData = {
        customerName: project.customerName,
        trackingCode: project.trackingCode,
        trackingUrl,
        serviceType: project.serviceType,
        accountNumber: project.contractId,
        completionDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };
      return renderCompletedEmail(data);
    }

    default:
      throw new Error(`Unknown email template: ${template}`);
  }
}

// ============================================
// Email Sending
// ============================================

export async function sendEmail(
  template: EmailTemplate,
  project: Project
): Promise<SendEmailResult> {
  const html = renderEmailTemplate(template, project);

  const templateData: EmailTemplateData = {
    customerName: project.customerName,
    trackingCode: project.trackingCode,
    trackingUrl: `${emailConfig.baseUrl}/track/${project.trackingCode}`,
    stageName: STAGE_CONFIGS[project.currentStage].name,
  };

  const subject = emailSubjects[template](templateData);

  const logEntry: EmailLogEntry = {
    id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    projectId: project.id,
    template,
    to: project.customerEmail,
    subject,
    sentAt: new Date(),
    status: "pending",
  };

  try {
    // Use the configured email provider
    switch (emailConfig.provider) {
      case "resend":
        // Resend integration would go here
        // const { data, error } = await resend.emails.send({
        //   from: emailConfig.from,
        //   to: project.customerEmail,
        //   subject,
        //   html,
        // });
        throw new Error("Resend not configured - set RESEND_API_KEY");

      case "sendgrid":
        // SendGrid integration would go here
        throw new Error("SendGrid not configured");

      case "smtp":
        // SMTP integration would go here
        throw new Error("SMTP not configured");

      case "mock":
      default:
        // Mock implementation - just log the email
        console.log(`[EMAIL MOCK] Sending ${template} email to ${project.customerEmail}`);
        console.log(`[EMAIL MOCK] Subject: ${subject}`);

        // Simulate async send
        await new Promise((resolve) => setTimeout(resolve, 100));

        logEntry.status = "sent";
        logEntry.messageId = `mock_${Date.now()}`;
        emailLog.push(logEntry);

        return {
          success: true,
          messageId: logEntry.messageId,
        };
    }
  } catch (error) {
    logEntry.status = "failed";
    logEntry.error = error instanceof Error ? error.message : "Unknown error";
    emailLog.push(logEntry);

    console.error(`[EMAIL ERROR] Failed to send ${template} email:`, error);

    return {
      success: false,
      error: logEntry.error,
    };
  }
}

// ============================================
// Email Trigger Service
// ============================================

export class EmailTriggerService {
  /**
   * Send welcome email when a project is created
   */
  async onProjectCreated(project: Project): Promise<SendEmailResult> {
    return sendEmail("welcome", project);
  }

  /**
   * Send stage update email when a project moves to a new stage
   */
  async onStageChanged(
    project: Project,
    newStage: ProjectStage
  ): Promise<SendEmailResult> {
    // Check if this is the final stage completion
    if (newStage === ProjectStage.FOLLOW_UP) {
      // Check if follow-up stage is completed
      const followUpStage = project.stages.find(
        (s) => s.stage === ProjectStage.FOLLOW_UP
      );
      if (followUpStage?.status === "completed") {
        return sendEmail("completed", project);
      }
    }

    // Send stage update for other stages
    return sendEmail("stage-update", project);
  }

  /**
   * Send completion email when all stages are done
   */
  async onProjectCompleted(project: Project): Promise<SendEmailResult> {
    return sendEmail("completed", project);
  }

  /**
   * Manually trigger an email (for admin use)
   */
  async sendManualEmail(
    template: EmailTemplate,
    project: Project
  ): Promise<SendEmailResult> {
    return sendEmail(template, project);
  }
}

// ============================================
// Email Log Functions
// ============================================

export function getEmailLog(projectId?: string): EmailLogEntry[] {
  if (projectId) {
    return emailLog.filter((e) => e.projectId === projectId);
  }
  return [...emailLog];
}

export function getEmailLogEntry(emailId: string): EmailLogEntry | undefined {
  return emailLog.find((e) => e.id === emailId);
}

// ============================================
// Export singleton instance
// ============================================

export const emailTriggerService = new EmailTriggerService();
