// import { resend } from "@/lib/resend";
// import VerificationEmail from "../../emails/VerificationEmail";
// import { ApiResponse } from "../../types/ApiResponse";

// export async function sendVerificationEmail(
//   email: string,
//   username: string,
//   verifyCode: string
// ): Promise<ApiResponse> {
//   try {
//     await resend.emails.send({
//       from: "onboarding@resend.dev",
//       to: email,
//       subject: "Mystry message | Verification code",
//       react: VerificationEmail({ username, otp: verifyCode }),
//     });
//     return {
//       success: true, // ✅ SUCCESS
//       message: "Verification email sent successfully",
//     };
//   } catch (emailError) {
//     console.log("Error sending verification email:", emailError);
//     return {
//       success: false,
//       message: "Error sending verification email",
//     };
//   }
// }

import nodemailer from "nodemailer";
import { ApiResponse } from "../../types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  otp: string
): Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Email Verification</title>
        </head>
        <body style="background-color: #f9f9f9; padding: 40px 0; font-family: Helvetica, Arial, sans-serif;">
          <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
            <h2 style="color: #333333; font-size: 24px; margin-bottom: 20px;">
              Hello ${username}, welcome aboard!
            </h2>
            <p style="color: #555555; font-size: 16px; line-height: 24px; margin-bottom: 16px;">
              Thanks for signing up. Please verify your account by using the OTP below:
            </p>
            <p style="font-size: 22px; font-weight: bold; color: #1d4ed8; text-align: center; margin-bottom: 20px;">
              ${otp}
            </p>
            <p style="font-size: 12px; color: #999999; text-align: center; margin-top: 30px;">
              If you didn’t request this email, you can safely ignore it.
            </p>
          </div>
        </body>
      </html>
    `;

    const plainText = `Hello ${username},\n\nThanks for signing up. Please verify your account using this OTP: ${otp}\n\nIf you didn't request this, just ignore this email.`;

    await transporter.sendMail({
      from: `"Mystry Message Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email | Mystry Message",
      text: plainText,
      html: htmlContent,
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
