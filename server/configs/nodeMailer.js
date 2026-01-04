import nodemailer from 'nodemailer';

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

const buildQrDataUri = () => {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">',
    '<rect width="160" height="160" fill="#f5f5f4"/>',
    '<rect x="12" y="12" width="44" height="44" fill="#111827"/>',
    '<rect x="20" y="20" width="28" height="28" fill="#f5f5f4"/>',
    '<rect x="104" y="12" width="44" height="44" fill="#111827"/>',
    '<rect x="112" y="20" width="28" height="28" fill="#f5f5f4"/>',
    '<rect x="12" y="104" width="44" height="44" fill="#111827"/>',
    '<rect x="20" y="112" width="28" height="28" fill="#f5f5f4"/>',
    '<rect x="70" y="70" width="20" height="20" fill="#111827"/>',
    '<rect x="92" y="70" width="12" height="12" fill="#111827"/>',
    '<rect x="70" y="92" width="12" height="12" fill="#111827"/>',
    '<rect x="102" y="102" width="20" height="20" fill="#111827"/>',
    '<rect x="124" y="78" width="12" height="12" fill="#111827"/>',
    '<rect x="78" y="124" width="12" height="12" fill="#111827"/>',
    '<text x="80" y="156" font-size="10" text-anchor="middle" fill="#6b7280">QR CODE</text>',
    "</svg>"
  ].join("");

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const buildBookingConfirmationEmail = ({
  userName = "Traveler",
  destinationTitle = "Your Trip",
  bookingId = "N/A",
  email = "N/A",
  visitDate = "Date not available",
  visitTime = "Time not available",
  amount = "N/A"
} = {}) => {
  const qrCodeSrc = buildQrDataUri();

  return `
  <div style="margin:0;padding:24px;background:#f3f4f6;">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;font-family:'Trebuchet MS','Segoe UI',Arial,sans-serif;color:#111827;">
      <div style="padding:28px 32px 18px 32px;border-bottom:1px solid #e5e7eb;">
        <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#6b7280;">Visit Ceylon</p>
        <h1 style="margin:8px 0 0 0;font-size:22px;font-weight:700;">Ticket Confirmation</h1>
        <p style="margin:6px 0 0 0;font-size:14px;color:#4b5563;">Thank you for booking with Visit Ceylon, ${userName}.</p>
      </div>

      <div style="padding:26px 32px 8px 32px;">
        <h2 style="margin:0;font-size:20px;font-weight:700;color:#111827;">${destinationTitle}</h2>
        <p style="margin:6px 0 0 0;font-size:13px;color:#6b7280;">Keep this email handy to enter the experience.</p>
      </div>

      <div style="padding:18px 32px 28px 32px;display:block;">
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="vertical-align:top;width:58%;">
              <div style="padding:14px 16px;border:1px solid #e5e7eb;border-radius:14px;background:#fafafa;">
                <p style="margin:0 0 10px 0;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#6b7280;">Ticket Details</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Booking ID:</strong> ${bookingId}</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Email:</strong> ${email}</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Date:</strong> ${visitDate}</p>
                <p style="margin:0 0 6px 0;font-size:14px;"><strong>Time:</strong> ${visitTime}</p>
                <p style="margin:0;font-size:14px;"><strong>Total Paid:</strong> ${amount}</p>
              </div>
            </td>
            <td style="vertical-align:top;width:42%;text-align:center;">
              <div style="margin:0 auto;padding:16px;border:1px solid #e5e7eb;border-radius:14px;background:#ffffff;display:inline-block;">
                <img src="${qrCodeSrc}" alt="QR code" width="160" height="160" style="display:block;border:0;" />
                <p style="margin:10px 0 0 0;font-size:12px;color:#6b7280;">Scan at entry</p>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div style="padding:0 32px 28px 32px;">
        <div style="padding:14px 16px;border:1px dashed #d1d5db;border-radius:12px;background:#fcfcfc;">
          <p style="margin:0 0 6px 0;font-size:13px;color:#4b5563;">Please arrive at least 15 minutes early.</p>
          <p style="margin:0 0 6px 0;font-size:13px;color:#4b5563;">Show this email or your QR code at the entrance.</p>
          <p style="margin:0;font-size:13px;color:#4b5563;">Need help? Contact us at <a href="mailto:support@visitceylon.com" style="color:#111827;text-decoration:none;">support@visitceylon.com</a>.</p>
        </div>
      </div>

      <div style="padding:18px 32px 28px 32px;border-top:1px solid #e5e7eb;background:#fafafa;">
        <p style="margin:0;font-size:12px;color:#6b7280;">We hope you enjoy discovering Sri Lanka with Visit Ceylon.</p>
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
