import nodemailer from 'nodemailer';
import QRCode from "qrcode";
import fs from "fs/promises";
import path from "path";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER?.trim(),
    pass: process.env.SMTP_PASS?.trim(),
  },
});

const buildQrDataUri = async (qrText = "") => {
  const safeText = qrText || "visitceylon-booking";
  try {
    return await QRCode.toDataURL(safeText, {
      errorCorrectionLevel: "M",
      width: 180,
      margin: 1,
      color: {
        dark: "#0f172a",
        light: "#ffffff"
      }
    });
  } catch (error) {
    console.error("QR code generation failed:", error.message);
    return "";
  }
};

const resolveLogoSrc = async (logoUrl = "") => {
  if (!logoUrl) return "";
  if (/^data:/i.test(logoUrl) || /^https?:\/\//i.test(logoUrl)) {
    return logoUrl;
  }

  const resolvedPath = path.isAbsolute(logoUrl)
    ? logoUrl
    : path.resolve(process.cwd(), logoUrl);

  try {
    const file = await fs.readFile(resolvedPath);
    const ext = path.extname(resolvedPath).toLowerCase();
    const mime =
      ext === ".svg"
        ? "image/svg+xml"
        : ext === ".png"
        ? "image/png"
        : "image/jpeg";

    return `data:${mime};base64,${file.toString("base64")}`;
  } catch (error) {
    console.error("Email logo load failed:", error.message);
    return "";
  }
};

export const buildBookingConfirmationEmail = async ({
  userName = "Traveler",
  destinationTitle = "Your Trip",
  bookingId = "N/A",
  email = "N/A",
  visitDate = "Date not available",
  visitTime = "Time not available",
  amount = "N/A",
  logoUrl = ""
} = {}) => {
  const qrPayload = JSON.stringify({
    bookingId,
    email,
    visitDate,
    visitTime,
    destinationTitle
  });
  const qrCodeSrc = await buildQrDataUri(qrPayload);
  const resolvedLogo = await resolveLogoSrc(logoUrl);
  const headerLogo = resolvedLogo
    ? `<img src="${resolvedLogo}" alt="Visit Ceylon" width="120" style="display:block;border:0;" />`
    : `<span style="font-size:16px;font-weight:700;color:#0f172a;letter-spacing:0.6px;">Visit Ceylon</span>`;

  return `
  <div style="margin:0;padding:32px;background:#e9f2f2;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:20px;overflow:hidden;font-family:'Trebuchet MS','Segoe UI',Arial,sans-serif;color:#0f172a;">
      <div style="padding:24px 32px;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
        ${headerLogo}
        <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700;">Ticket Confirmation</h1>
        <p style="margin:6px 0 0 0;font-size:14px;color:#475569;">Thank you for booking with Visit Ceylon, ${userName}.</p>
      </div>

      <div style="padding:26px 32px 8px 32px;">
        <h2 style="margin:0;font-size:20px;font-weight:700;color:#111827;">${destinationTitle}</h2>
        <p style="margin:6px 0 0 0;font-size:13px;color:#64748b;">Keep this email handy to enter the experience.</p>
        <p style="margin:10px 0 0 0;font-size:13px;color:#0f766e;font-weight:600;">Enjoy your adventure with Visit Ceylon.</p>
      </div>

      <div style="padding:18px 32px 28px 32px;display:block;">
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top;width:58%;">
              <div style="padding:14px 16px;border:1px solid #d1f2f3;border-radius:14px;background:#e7fbfb;">
                <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#008a8f;">Ticket Details</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Booking ID:</strong> ${bookingId}</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Email:</strong> ${email}</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Date:</strong> ${visitDate}</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Time:</strong> ${visitTime}</p>
                <p style="margin:0;font-size:14px;"><strong>Total Paid:</strong> ${amount}</p>
              </div>
            </td>
            <td style="vertical-align:top;width:42%;text-align:center;">
              <div style="margin:0 auto;padding:16px;border:1px solid #d1f2f3;border-radius:14px;background:#ffffff;display:inline-block;">
                ${
                  qrCodeSrc
                    ? `<img src="${qrCodeSrc}" alt="QR code" width="160" height="160" style="display:block;border:0;" />`
                    : `<div style="width:160px;height:160px;display:flex;align-items:center;justify-content:center;border:1px dashed #94a3b8;border-radius:12px;color:#64748b;font-size:12px;">QR code unavailable</div>`
                }
                <p style="margin:10px 0 0 0;font-size:12px;color:#0f766e;">Scan at entry</p>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div style="padding:0 32px 28px 32px;">
        <div style="padding:14px 16px;border:1px dashed #00a6ac;border-radius:12px;background:linear-gradient(120deg, rgba(0,166,172,0.12), rgba(0,148,84,0.08));">
          <p style="margin:0 0 6px 0;font-size:13px;color:#0f172a;">Please arrive at least 15 minutes early.</p>
          <p style="margin:0 0 6px 0;font-size:13px;color:#0f172a;">Show this email or your QR code at the entrance.</p>
          <p style="margin:0;font-size:13px;color:#0f172a;">Need help? Contact us at <a href="mailto:support@visitceylon.com" style="color:#009454;text-decoration:none;">support@visitceylon.com</a>.</p>
        </div>
      </div>

      <div style="padding:18px 32px 28px 32px;border-top:1px solid #e2e8f0;background:#f8fafc;">
        <p style="margin:0;font-size:12px;color:#64748b;">We hope you enjoy discovering Sri Lanka with Visit Ceylon.</p>
      </div>
    </div>
  </div>
  `;
};

const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body
  });
  return response;
};

export default sendEmail;
