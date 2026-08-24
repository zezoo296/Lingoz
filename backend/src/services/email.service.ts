import resend from "../config/resend";
import { config } from "../config/env";
import AppError from "../utils/AppError";

const buildPasswordResetOtpEmail = (otp: string) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your LinguaChat password</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f0f14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#1a1a24;border:1px solid #2a2a3a;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;background:linear-gradient(180deg,#7c3aed22 0%,transparent 100%);">
              <div style="display:inline-block;width:40px;height:40px;border-radius:10px;background-color:#7c3aed;line-height:40px;font-size:18px;color:#ffffff;">💬</div>
              <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#f4f4f5;">LinguaChat</h1>
              <p style="margin:0;font-size:14px;color:#a1a1aa;">Password reset verification</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d4d4d8;">
                Use the code below to reset your password. This code expires in <strong style="color:#a78bfa;">5 minutes</strong>.
              </p>
              <div style="margin:24px 0;padding:20px;border-radius:12px;background-color:#0f0f14;border:1px solid #2a2a3a;text-align:center;">
                <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#a78bfa;">${otp}</span>
              </div>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
                If you did not request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
};

const buildWelcomeEmail = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to LinguaChat</title>
</head>
<body style="margin:0;padding:0;background-color:#0f0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0f0f14;padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:480px;background-color:#1a1a24;border:1px solid #2a2a3a;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;background:linear-gradient(180deg,#7c3aed22 0%,transparent 100%);">
              <div style="display:inline-block;width:40px;height:40px;border-radius:10px;background-color:#7c3aed;line-height:40px;font-size:18px;color:#ffffff;">💬</div>
              <h1 style="margin:16px 0 8px;font-size:22px;font-weight:700;color:#f4f4f5;">Welcome to LinguaChat</h1>
              <p style="margin:0;font-size:14px;color:#a1a1aa;">Your language-learning journey starts here</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d4d4d8;">
                Your account is ready. Start chatting, practising, and building confidence in a new language.
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:#71717a;">
                We're glad to have you with us.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();
};

export const sendPasswordResetOtpEmail = async (
    email: string,
    otp: string,
): Promise<void> => {
    if (!config.resendApiKey) {
        throw new AppError("Email service is not configured", 500);
    }

    const { error, data } = await resend.emails.send({
        from: config.resendFromEmail,
        to: email,
        subject: "Your LinguaChat password reset code",
        html: buildPasswordResetOtpEmail(otp),
    });
    if (error) {
        throw new AppError("Failed to send password reset email", 500);
    }
};

export const sendWelcomeEmail = async (email: string): Promise<void> => {
    if (!config.resendApiKey) {
        throw new AppError("Email service is not configured", 500);
    }
    
    const { error } = await resend.emails.send({
        from: config.resendFromEmail,
        to: email,
        subject: "Welcome to LinguaChat",
        html: buildWelcomeEmail(),
    });
    if (error) {
        throw new AppError("Failed to send welcome email", 500);
    }
};
