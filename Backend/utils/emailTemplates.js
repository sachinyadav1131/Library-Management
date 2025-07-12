export function generateVerificationOtpEmailTemplate(otpCode) {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
    <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>

    <p style="font-size: 16px; color: #555;">Dear User,</p>

    <p style="font-size: 16px; color: #555;">
      To complete your registration or login, please use the verification code below:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #222; background-color: #f5f5f5; padding: 12px 24px; border-radius: 8px; letter-spacing: 4px;">
        ${otpCode}
      </span>
    </div>

    <p style="font-size: 16px; color: #888;">This code is valid for <strong>15 minutes</strong>. Please do not share this code with anyone.</p>

    <p style="font-size: 16px; color: #888;">
      If you did not request this email, you can safely ignore it.
    </p>

    <footer style="margin-top: 40px; text-align: center; font-size: 14px; color: #999;">
      <p>Thank you,<br><strong>Bookbloom Team</strong></p>
      <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
    </footer>
  </div>
  `;
}

export function generateForgotPasswordEmailTemplate(resetPasswordUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #fff; text-align: center;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #ccc;">Dear User,</p>
      <p style="font-size: 16px; color: #ccc;">You requested to reset your password. Please click the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPasswordUrl}" 
           style="display: inline-block; font-size: 16px; font-weight: bold; color: #000; text-decoration: none;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 16px; color: #ccc;">
        If you did not request this, please ignore this email. The link will expire shortly.
      </p>
      <p style="font-size: 16px; color: #ccc;">
        If the button above doesn't work, copy and paste the following URL into your browser:
      </p>
      <p style="font-size: 16px; color: #fff; word-wrap: break-word;">${resetPasswordUrl}</p>
      <p style="margin-top: 20px; text-align: center; font-size: 14px; color: #666;">Thank you, <br/>BookiHorn Team</p>
      <p style="font-size: 12px; color: #444;">This is an automated message. Please do not reply to this email.</p>
    </div>
  `;
}

