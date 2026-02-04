// ============================================
// Welcome Email Template
// ============================================

import { emailColors, EmailTemplateData } from "../config";
import { renderBaseLayout } from "./base-layout";

export interface WelcomeEmailData extends EmailTemplateData {
  serviceAddress: string;
  serviceType?: string;
}

export function renderWelcomeEmail(data: WelcomeEmailData): string {
  const content = `
    <h1 style="margin: 0 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; color: ${emailColors.navy};">
      Welcome to Lightcurve, ${data.customerName}!
    </h1>

    <p style="margin: 0 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${emailColors.gray[700]};">
      Your fiber installation project has been created and our team is ready to get you connected. Here's your tracking information:
    </p>

    <!-- Tracking Info Box -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td style="background-color: ${emailColors.gray[50]}; border: 1px solid ${emailColors.gray[200]}; border-radius: 8px; padding: 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-bottom: 12px; border-bottom: 1px solid ${emailColors.gray[200]};">
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${emailColors.gray[500]};">Tracking Code</p>
                <p style="margin: 4px 0 0; font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: ${emailColors.navy}; letter-spacing: 2px;">${data.trackingCode}</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 12px;">
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${emailColors.gray[500]};">Service Address</p>
                <p style="margin: 4px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: ${emailColors.charcoal};">${data.serviceAddress}</p>
              </td>
            </tr>
            ${data.serviceType ? `
            <tr>
              <td style="padding-top: 12px;">
                <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${emailColors.gray[500]};">Service Type</p>
                <p style="margin: 4px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; color: ${emailColors.charcoal};">${data.serviceType}</p>
              </td>
            </tr>
            ` : ""}
          </table>
        </td>
      </tr>
    </table>

    <!-- CTA Button -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 30px;">
      <tr>
        <td align="center">
          <a href="${data.trackingUrl}" class="button" style="background-color: ${emailColors.wave}; border-radius: 6px; color: ${emailColors.white}; display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; line-height: 1; padding: 14px 28px; text-decoration: none; text-align: center;">
            Track My Project →
          </a>
        </td>
      </tr>
    </table>

    <!-- What's Next Section -->
    <h2 style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 600; color: ${emailColors.navy};">
      What happens next?
    </h2>

    <p style="margin: 0 0 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${emailColors.gray[700]};">
      Our team will begin the <strong>Outside Plant</strong> phase, which includes obtaining necessary permits and preparing the fiber route to your location. You'll receive updates as we progress through each stage.
    </p>

    <!-- Timeline Preview -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin: 0 0 20px;">
      <tr>
        <td style="background-color: ${emailColors.gray[50]}; border-radius: 8px; padding: 20px;">
          <p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${emailColors.navy};">Your Installation Journey:</p>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.wave};">● Outside Plant</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">○ Fiber Delivery</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">○ Network Setup</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">○ Release to Billing</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">○ Follow-Up</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">
      Your tracking code was included in this email for your records. You can check your project status anytime using the button above.
    </p>
  `;

  return renderBaseLayout({
    previewText: `Your fiber installation project has started! Tracking code: ${data.trackingCode}`,
    content,
  });
}
