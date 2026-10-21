import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export const sendPasswordResetEmail = async (
  to: string,
  otp: string,
  userName: string
) => {
  const mailOptions = {
    from: `"NoSurgeries 🏥" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Password Reset Code — NoSurgeries",
    html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8" /></head>
    <body style="margin:0;padding:0;background:#0d1224;font-family:'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1224;padding:40px 20px;">
        <tr><td align="center">
          <table width="520" cellpadding="0" cellspacing="0" style="background:rgba(28,38,70,0.9);border:1px solid rgba(41,196,224,0.25);border-radius:20px;overflow:hidden;">
            <!-- Top accent bar -->
            <tr><td height="4" style="background:linear-gradient(90deg,#5b2d8e,#e8297c,#29c4e0);"></td></tr>
            <tr><td style="padding:36px 40px 28px;">
              <!-- Logo text -->
              <p style="margin:0 0 24px;font-size:20px;font-weight:800;color:#f1f5f9;letter-spacing:-0.5px;">
                🏥 NoSurgeries
              </p>
              <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#f1f5f9;">Password Reset Code</h1>
              <p style="margin:0 0 28px;font-size:14px;color:rgba(103,232,249,0.8);">Hi ${userName}, use the code below to reset your password.</p>

              <!-- OTP box -->
              <div style="background:rgba(41,196,224,0.08);border:2px solid rgba(41,196,224,0.35);border-radius:14px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:rgba(103,232,249,0.7);letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
                <p style="margin:0;font-size:44px;font-weight:800;color:#29c4e0;letter-spacing:12px;">${otp}</p>
              </div>

              <p style="margin:0 0 8px;font-size:14px;color:rgba(255,255,255,0.55);">⏰ This code expires in <strong style="color:#f1f5f9;">15 minutes</strong>.</p>
              <p style="margin:0 0 28px;font-size:13px;color:rgba(255,255,255,0.35);">If you didn't request this, you can safely ignore this email.</p>

              <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin-bottom:20px;" />
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);text-align:center;">© 2026 NoSurgeries Healthcare Platform · All rights reserved</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
