const nodemailer = require('nodemailer');

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn('[mailer] EMAIL_USER or EMAIL_PASS not set. Emails will not be sent.');
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });

  return cachedTransporter;
}

function buildSubscriberConfirmationHtml(name) {
  const displayName = name && name.trim() ? name.trim() : 'Adventurer';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to Gilgit Adventure Treks</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#1a2332;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#1a2332;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:0.5px;">Gilgit Adventure Treks</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Explore the roof of the world</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px 24px;">
              <h2 style="margin:0 0 16px;color:#1a2332;font-size:22px;">Welcome aboard, ${escapeHtml(displayName)}!</h2>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3a4658;">
                Thank you for subscribing to <strong>Gilgit Adventure Treks</strong>. You are now part of a community of over 12,000 adventure seekers who get our latest trek updates, seasonal alerts, and exclusive deals for Northern Pakistan.
              </p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3a4658;">
                Here is what you can expect from us:
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.8;color:#3a4658;">
                <li>Exclusive seasonal trek deals and discounts</li>
                <li>Weather and route updates for Gilgit-Baltistan</li>
                <li>Insider guides to destinations like K2, Fairy Meadows, Deosai, and more</li>
                <li>Early access to new jeep safari packages</li>
              </ul>
              <div style="text-align:center;margin:32px 0;">
                <a href="https://gilgitadventuretreks.com" style="display:inline-block;background:#1a2332;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">Explore Destinations</a>
              </div>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6b7684;">
                If you did not subscribe, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f4f6f9;padding:24px 32px;text-align:center;font-size:12px;color:#6b7684;">
              <p style="margin:0 0 8px;">&copy; ${new Date().getFullYear()} Gilgit Adventure Treks. All rights reserved.</p>
              <p style="margin:0;">You received this email because you subscribed to our newsletter.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendSubscriberConfirmation({ email, name }) {
  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: 'email_not_configured' };

  const fromName = 'Gilgit Adventure Treks';
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: email,
    subject: 'Welcome to Gilgit Adventure Treks!',
    html: buildSubscriberConfirmationHtml(name),
    text: `Welcome aboard${name ? ', ' + name : ''}!\n\nThank you for subscribing to Gilgit Adventure Treks. You will now receive exclusive trek deals, seasonal alerts, and insider guides for Northern Pakistan.\n\nVisit us: https://gilgitadventuretreks.com\n\n© ${new Date().getFullYear()} Gilgit Adventure Treks`
  });

  return { sent: true, messageId: info.messageId };
}

function buildBookingConfirmationHtml(booking) {
  const name = booking.customerName || 'Adventurer';
  const nights = booking.checkIn && booking.checkOut
    ? Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24))
    : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmation</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#1a2332;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#1B4332;padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:0.5px;">Gilgit Adventure Treks</h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Booking Confirmation</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px 32px 16px;">
              <div style="text-align:center;margin-bottom:24px;">
                <div style="display:inline-block;width:64px;height:64px;border-radius:50%;background:#dcfce7;line-height:64px;text-align:center;">
                  <span style="font-size:32px;color:#166534;">&#10003;</span>
                </div>
              </div>
              <h2 style="margin:0 0 8px;color:#1a2332;font-size:22px;text-align:center;">Booking Confirmed!</h2>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3a4658;text-align:center;">
                Thank you, <strong>${escapeHtml(name)}</strong>! Your adventure has been booked successfully.
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding:8px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Reference</td>
                  <td style="padding:8px 16px;font-size:14px;font-weight:700;color:#1a2332;border-bottom:1px solid #e2e8f0;text-align:right;">${escapeHtml(booking.reference)}</td>
                </tr>
                <tr>
                  <td style="padding:8px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Destination</td>
                  <td style="padding:8px 16px;font-size:14px;color:#1a2332;border-bottom:1px solid #e2e8f0;text-align:right;">${escapeHtml(booking.destination)}</td>
                </tr>
                ${booking.region ? `<tr>
                  <td style="padding:8px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Region</td>
                  <td style="padding:8px 16px;font-size:14px;color:#1a2332;border-bottom:1px solid #e2e8f0;text-align:right;">${escapeHtml(booking.region)}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:8px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Dates</td>
                  <td style="padding:8px 16px;font-size:14px;color:#1a2332;border-bottom:1px solid #e2e8f0;text-align:right;">${booking.checkIn ? escapeHtml(booking.checkIn) + ' to ' + escapeHtml(booking.checkOut) : 'Flexible'}</td>
                </tr>
                ${nights ? `<tr>
                  <td style="padding:8px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Duration</td>
                  <td style="padding:8px 16px;font-size:14px;color:#1a2332;border-bottom:1px solid #e2e8f0;text-align:right;">${nights} day${nights > 1 ? 's' : ''}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:8px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Travelers</td>
                  <td style="padding:8px 16px;font-size:14px;color:#1a2332;border-bottom:1px solid #e2e8f0;text-align:right;">${booking.adults} adult${booking.adults > 1 ? 's' : ''}${booking.children ? ', ' + booking.children + ' child' + (booking.children > 1 ? 'ren' : '') : ''}</td>
                </tr>
                ${booking.infants > 0 ? `<tr>
                  <td style="padding:8px 16px;font-size:14px;color:#64748b;border-bottom:1px solid #e2e8f0;">Porters</td>
                  <td style="padding:8px 16px;font-size:14px;color:#1a2332;border-bottom:1px solid #e2e8f0;text-align:right;">${booking.infants}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:12px 16px;font-size:16px;font-weight:700;color:#1B4332;">Total</td>
                  <td style="padding:12px 16px;font-size:16px;font-weight:700;color:#1B4332;text-align:right;">PKR ${Number(booking.totalPrice || 0).toLocaleString('en-PK')}</td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:14px;color:#3a4658;"><strong>Contact:</strong> ${escapeHtml(booking.customerEmail)}${booking.customerPhone ? ' | ' + escapeHtml(booking.customerPhone) : ''}</p>
              <p style="margin:0 0 24px;font-size:14px;color:#3a4658;"><strong>Status:</strong> Pending Confirmation</p>
              <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#64748b;">
                Our team will contact you shortly to confirm your booking and share travel details, packing list, and meeting point information.
              </p>
              <div style="text-align:center;margin:24px 0;">
                <a href="https://gilgitadventuretreks.com" style="display:inline-block;background:#1B4332;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:600;font-size:15px;">Visit Our Website</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f4f6f9;padding:24px 32px;text-align:center;font-size:12px;color:#6b7684;">
              <p style="margin:0 0 8px;">&copy; ${new Date().getFullYear()} Gilgit Adventure Treks. All rights reserved.</p>
              <p style="margin:0;">Please save this email as your booking receipt.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildBookingConfirmationText(booking) {
  const name = booking.customerName || 'Adventurer';
  return `Booking Confirmed!\n\nThank you, ${name}! Your adventure has been booked.\n\nReference: ${booking.reference}\nDestination: ${booking.destination}\nDates: ${booking.checkIn ? booking.checkIn + ' to ' + booking.checkOut : 'Flexible'}\nTravelers: ${booking.adults} adult(s)${booking.children ? ', ' + booking.children + ' child(ren)' : ''}\nTotal: PKR ${Number(booking.totalPrice || 0).toLocaleString('en-PK')}\n\nOur team will contact you shortly to confirm your booking.\n\n© ${new Date().getFullYear()} Gilgit Adventure Treks`;
}

async function sendBookingConfirmation(booking) {
  if (!booking.customerEmail) return { sent: false, reason: 'no_customer_email' };

  const transporter = getTransporter();
  if (!transporter) return { sent: false, reason: 'email_not_configured' };

  const fromName = 'Gilgit Adventure Treks';
  const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromAddress}>`,
    to: booking.customerEmail,
    subject: `Booking Confirmed — ${booking.reference} | Gilgit Adventure Treks`,
    html: buildBookingConfirmationHtml(booking),
    text: buildBookingConfirmationText(booking)
  });

  return { sent: true, messageId: info.messageId };
}

module.exports = { sendSubscriberConfirmation, sendBookingConfirmation };
