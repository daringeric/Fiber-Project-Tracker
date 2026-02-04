// ============================================
// Base Email Layout Template
// ============================================

import { emailConfig, emailColors } from "../config";

export interface BaseLayoutProps {
  previewText: string;
  content: string;
}

export function renderBaseLayout({ previewText, content }: BaseLayoutProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${emailConfig.companyName}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: ${emailColors.gray[100]};
    }
    .button {
      background-color: ${emailColors.wave};
      border-radius: 6px;
      color: ${emailColors.white} !important;
      display: inline-block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 600;
      line-height: 1;
      padding: 14px 28px;
      text-decoration: none;
      text-align: center;
    }
    .button:hover {
      background-color: #008B94;
    }
    .button-navy {
      background-color: ${emailColors.navy};
    }
    .button-navy:hover {
      background-color: #1a1463;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
      .content {
        padding: 20px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${emailColors.gray[100]};">
  <!-- Preview text -->
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${previewText}
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Email wrapper -->
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${emailColors.gray[100]};">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <!-- Main container -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="container" style="background-color: ${emailColors.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${emailColors.navy} 0%, #1a1463 100%); padding: 30px; text-align: center;">
              <!-- Logo -->
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <div style="display: inline-block;">
                      <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: bold; color: ${emailColors.white};">Light<span style="color: ${emailColors.wave};">curve</span></span>
                    </div>
                    <p style="margin: 8px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${emailColors.gray[300]}; text-transform: uppercase; letter-spacing: 2px;">Fiber Tracker</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content" style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${emailColors.gray[50]}; padding: 30px; border-top: 1px solid ${emailColors.gray[200]};">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">
                      Questions? Contact us at <a href="mailto:${emailConfig.supportEmail}" style="color: ${emailColors.wave}; text-decoration: none;">${emailConfig.supportEmail}</a>
                    </p>
                    <p style="margin: 0 0 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: ${emailColors.gray[500]};">
                      Or call us at <a href="tel:${emailConfig.supportPhone}" style="color: ${emailColors.wave}; text-decoration: none;">${emailConfig.supportPhone}</a>
                    </p>
                    <p style="margin: 20px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${emailColors.gray[500]};">
                      © ${new Date().getFullYear()} ${emailConfig.companyName}. All rights reserved.
                    </p>
                    <p style="margin: 10px 0 0;">
                      <a href="${emailConfig.baseUrl}/privacy" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${emailColors.gray[500]}; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                      <a href="${emailConfig.baseUrl}/terms" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${emailColors.gray[500]}; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}
