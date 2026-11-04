require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Escape user-supplied strings before embedding them in HTML
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendRegistrationEmail(userEmail, name) {
  const safeName = escapeHtml(name);

  const subject = "Welcome to SewaSetu!";

  const text = `Hello ${name},

Thank you for registering with SewaSetu.
We are excited to have you on board!

SewaSetu connects you with trusted local service providers in Nepal, including plumbers, electricians, cleaners, tutors, painters, and technicians.

Best Regards,
SewaSetu Team`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to SewaSetu</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f4f6f8; padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#2563eb; padding:32px 24px;">
              <h1 style="margin:0; color:#ffffff; font-size:28px; letter-spacing:0.5px;">SewaSetu</h1>
              <p style="margin:8px 0 0; color:#dbeafe; font-size:14px;">Trusted local services, one click away</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 32px 16px; color:#1f2937; font-size:16px; line-height:1.6;">
              <h2 style="margin:0 0 16px; font-size:22px; color:#111827;">Hello ${safeName},</h2>
              <p style="margin:0 0 16px;">
                Thank you for registering with <strong>SewaSetu</strong>. We are excited to have you on board!
              </p>
              <p style="margin:0 0 16px;">
                SewaSetu connects you with trusted local service providers across Nepal. With your new account, you can:
              </p>
              <ul style="margin:0 0 16px; padding-left:20px;">
                <li style="margin-bottom:8px;">Find professionals like plumbers, electricians, cleaners, tutors, painters, and technicians</li>
                <li style="margin-bottom:8px;">View detailed provider profiles</li>
                <li style="margin-bottom:8px;">Book services quickly and easily</li>
                <li style="margin-bottom:8px;">Leave reviews to help others choose wisely</li>
              </ul>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb; padding:24px 32px; border-top:1px solid #e5e7eb; color:#6b7280; font-size:13px; line-height:1.5;" align="center">
              <p style="margin:0 0 8px;">Best Regards,<br /><strong>SewaSetu Team</strong></p>
              <p style="margin:0;">&copy; ${new Date().getFullYear()} SewaSetu. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const info = await transporter.sendMail({
    from: `"SewaSetu" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
  return info;
}

module.exports = { sendRegistrationEmail };