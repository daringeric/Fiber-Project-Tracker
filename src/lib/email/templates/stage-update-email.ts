// ============================================
// Stage Update Email Template
// ============================================

import { emailColors, EmailTemplateData } from "../config";
import { renderBaseLayout } from "./base-layout";

export interface StageUpdateEmailData extends EmailTemplateData {
  stageName: string;
  stageDescription: string;
  progress: number;
  completedStages: string[];
  currentStage: string;
  remainingStages: string[];
}

export function renderStageUpdateEmail(data: StageUpdateEmailData): string {
  // Create progress bar
  const progressWidth = Math.max(5, data.progress); // Minimum 5% for visibility

  const content = `
    <h1 style="margin: 0 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; color: ${emailColors.navy};">
      Hi ${data.customerName},
    </h1>

    <p style="margin: 0 0 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.6; color: ${emailColors.gray[700]};">
      Great news! Your fiber project has moved forward.
    </p>

    <!-- Stage Update Box -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td style="background: linear-gradient(135deg, ${emailColors.wave} 0%, #008B94 100%); border-radius: 8px; padding: 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.8);">Now In Progress</p>
                <p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; color: ${emailColors.white};">${data.stageName}</p>
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: rgba(255,255,255,0.9);">${data.stageDescription}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Progress Bar -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td>
          <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.navy};">Overall Progress: ${data.progress}%</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="background-color: ${emailColors.gray[200]}; border-radius: 4px; height: 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="${progressWidth}%">
                  <tr>
                    <td style="background: linear-gradient(90deg, ${emailColors.wave} 0%, ${emailColors.violetta} 100%); border-radius: 4px; height: 8px;"></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Stage Timeline -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: ${emailColors.gray[50]}; border-radius: 8px; padding: 20px;">
          <p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.navy};">Installation Progress:</p>

          ${data.completedStages.map(stage => `
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 8px;">
            <tr>
              <td width="24" valign="top">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${emailColors.wave}; border-radius: 50%; text-align: center; line-height: 20px; color: white; font-size: 12px;">✓</span>
              </td>
              <td style="padding-left: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]}; text-decoration: line-through;">${stage}</td>
            </tr>
          </table>
          `).join("")}

          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 8px;">
            <tr>
              <td width="24" valign="top">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${emailColors.wave}; border-radius: 50%; text-align: center; line-height: 20px; color: white; font-size: 10px;">●</span>
              </td>
              <td style="padding-left: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.wave};">${data.currentStage}</td>
            </tr>
          </table>

          ${data.remainingStages.map(stage => `
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 8px;">
            <tr>
              <td width="24" valign="top">
                <span style="display: inline-block; width: 20px; height: 20px; background-color: ${emailColors.gray[300]}; border-radius: 50%;"></span>
              </td>
              <td style="padding-left: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">${stage}</td>
            </tr>
          </table>
          `).join("")}
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 20px;">
      <tr>
        <td align="center">
          <a href="${data.trackingUrl}" class="button" style="background-color: ${emailColors.wave}; border-radius: 6px; color: ${emailColors.white}; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; line-height: 1; padding: 14px 28px; text-decoration: none; text-align: center;">
            View Full Details →
          </a>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]}; text-align: center;">
      Tracking Code: <strong>${data.trackingCode}</strong>
    </p>
  `;

  return renderBaseLayout({
    previewText: `Your fiber project has moved to ${data.stageName}! Progress: ${data.progress}%`,
    content,
  });
}
