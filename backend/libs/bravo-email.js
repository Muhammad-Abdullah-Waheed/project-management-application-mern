// sendVerificationEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create reusable transporter object using Brevo SMTP
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // use TLS? false for 587
    auth: {
        user: process.env.BREVO_USER, // your Brevo SMTP email
        pass: process.env.BREVO_PASS, // your Brevo SMTP password/key
    },
});

/**
 * Send a verification email to a user
 * @param {string} email - Recipient email
 * @param {string} token - Verification token to include in link
 */
export const sendVerificationEmail = async (email, token) => {
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    // Compose email
    const mailOptions = {
        from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
        to: email,
        subject: "(TaskPilot) Verify Your Email",
        html: `
      <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f7; padding:40px;">
          <table width="100%" style="max-width:600px;margin:auto;background:#fff;border-radius:8px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="text-align:center;">
                <h1 style="color:#333;">Verify Your Email</h1>
                <p style="color:#555;font-size:16px;">
                  Thank you for signing up! Please click the button below to verify your email address and activate your account.
                </p>
                <a href="${verificationLink}"
                   style="display:inline-block;margin-top:20px;padding:15px 25px;
                          background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
                   Verify Email
                </a>
                <p style="margin-top:30px;font-size:12px;color:#999;">
                  If you did not sign up for this account, please ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.messageId);
        return info; // Return info for logging or BullMQ
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw error; // Re-throw for retries if using queues
    }
};

export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    // Compose email
    const mailOptions = {
        from: `"${process.env.BREVO_SENDER_NAME}" <${process.env.BREVO_SENDER_EMAIL}>`,
        to: email,
        subject: "(TaskPilot) Reset Your Password",
        html: `
      <html>
        <body style="font-family: Arial, sans-serif; background:#f4f4f7; padding:40px;">
          <table width="100%" style="max-width:600px;margin:auto;background:#fff;border-radius:8px;padding:40px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr>
              <td style="text-align:center;">
                <h1 style="color:#333;">Reset Your Password</h1>
                <p style="color:#555;font-size:16px;">
                  You have requested to reset your password. Please click the button below to reset your password.
                </p>
                <a href="${resetLink}"
                   style="display:inline-block;margin-top:20px;padding:15px 25px;
                          background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
                   Reset Password
                </a>
                <p style="margin-top:30px;font-size:12px;color:#999;">
                  If you did not request to reset your password, please ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", info.messageId);
        return info; // Return info for logging or BullMQ
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error; // Re-throw for retries if using queues
    }
};
