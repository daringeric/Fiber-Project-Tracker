// ============================================
// Project Completed Email Template
// ============================================

import { emailColors, EmailTemplateData, emailConfig } from "../config";
import { renderBaseLayout } from "./base-layout";

export interface CompletedEmailData extends EmailTemplateData {
  serviceType?: string;
  accountNumber?: string;
  completionDate: string;
}

export function renderCompletedEmail(data: CompletedEmailData): string {
  const content = `
    <!-- Celebration Header -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td align="center">
          <div style="font-size: 48px; margin-bottom: 16px;">🎉</div>
          <h1 style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${emailColors.navy};">
            Congratulations, ${data.customerName}!
          </h1>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; color: ${emailColors.gray[700]};">
            Your fiber installation is complete!
          </p>
        </td>
      </tr>
    </table>

    <!-- Completed Stages -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td style="background: linear-gradient(135deg, ${emailColors.navy} 0%, #1a1463 100%); border-radius: 8px; padding: 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${["Outside Plant", "Fiber Delivery", "Network Setup", "Release to Billing", "Follow-Up"].map(stage => `
            <tr>
              <td style="padding: 8px 0;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td width="30" valign="middle">
                      <span style="display: inline-block; width: 24px; height: 24px; background-color: ${emailColors.wave}; border-radius: 50%; text-align: center; line-height: 24px; color: white; font-size: 14px;">✓</span>
                    </td>
                    <td style="padding-left: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: ${emailColors.white};">${stage}</td>
                    <td align="right" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.wave};">Complete</td>
                  </tr>
                </table>
              </td>
            </tr>
            `).join("")}
          </table>
        </td>
      </tr>
    </table>

    <!-- Service Info Box -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: ${emailColors.gray[50]}; border: 1px solid ${emailColors.gray[200]}; border-radius: 8px; padding: 24px;">
          <p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: ${emailColors.navy};">Your Service Details:</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            ${data.serviceType ? `
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">Service Plan</td>
              <td align="right" style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.charcoal};">${data.serviceType}</td>
            </tr>
            ` : ""}
            ${data.accountNumber ? `
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">Account Number</td>
              <td align="right" style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.charcoal};">${data.accountNumber}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">Completion Date</td>
              <td align="right" style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.charcoal};">${data.completionDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">Status</td>
              <td align="right" style="padding: 8px 0;">
                <span style="display: inline-block; background-color: ${emailColors.wave}; color: white; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 12px;">ACTIVE</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Buttons -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td align="center">
          <a href="${emailConfig.baseUrl}/account" class="button" style="background-color: ${emailColors.wave}; border-radius: 6px; color: ${emailColors.white}; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; line-height: 1; padding: 14px 28px; text-decoration: none; text-align: center; margin-right: 12px;">
            Access My Account →
          </a>
        </td>
      </tr>
    </table>

    <!-- Thank You Message -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 20px;">
      <tr>
        <td style="text-align: center;">
          <p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: ${emailColors.gray[700]};">
            Thank you for choosing <strong>Lightcurve</strong>!
          </p>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">
            We're thrilled to have you connected. If you have any questions about your new service, our support team is here to help.
          </p>
        </td>
      </tr>
    </table>

    <!-- Speed Test Tip -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0;">
      <tr>
        <td style="background-color: ${emailColors.wave}10; border-left: 4px solid ${emailColors.wave}; border-radius: 4px; padding: 16px;">
          <p style="margin: 0 0 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.navy};">💡 Pro Tip</p>
          <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[700]};">
            Run a speed test at <a href="https://fast.com" style="color: ${emailColors.wave}; text-decoration: none;">fast.com</a> to verify your blazing-fast fiber connection!
          </p>
        </td>
      </tr>
    </table>
  `;

  return renderBaseLayout({
    previewText: `Congratulations! Your Lightcurve fiber installation is complete and your service is now active.`,
    content,
  });
}
