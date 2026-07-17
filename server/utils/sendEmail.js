// ─── Resend Email Helper ──────────────────────────────────────
// Wraps the Resend SDK; called by the contact route handler.

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a contact-form enquiry email.
 *
 * @param {Object} data
 * @param {string} data.name        – Sender's full name
 * @param {string} data.email       – Sender's email address
 * @param {string} data.phone       – Sender's phone number
 * @param {string} data.projectType – e.g. "New Home", "Renovation"
 * @param {string} data.budget      – e.g. "₹25L – ₹50L"
 * @param {string} data.message     – Free-text description
 * @returns {Promise<Object>}       – Resend API response
 */
async function sendContactEmail(data) {
  const { name, email, phone, projectType, budget, message } = data;

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0F0E0B; color: #F5F0E8; padding: 40px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; width: 14px; height: 14px; background: #B8913A; transform: rotate(45deg); margin-bottom: 12px;"></div>
        <h1 style="font-family: Georgia, serif; font-size: 22px; font-weight: 300; letter-spacing: 0.2em; color: #F5F0E8; margin: 0;">A SQUARE HOMES</h1>
      </div>
      <hr style="border: none; border-top: 0.5px solid rgba(184,145,58,0.3); margin: 24px 0;" />
      <p style="font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #B8913A; margin-bottom: 20px;">New Enquiry Received</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #9A9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; width: 130px; vertical-align: top;">Name</td>
          <td style="padding: 10px 0; color: #F5F0E8; font-size: 14px;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #9A9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Email</td>
          <td style="padding: 10px 0; color: #F5F0E8; font-size: 14px;"><a href="mailto:${email}" style="color: #B8913A; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #9A9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Phone</td>
          <td style="padding: 10px 0; color: #F5F0E8; font-size: 14px;"><a href="tel:${phone}" style="color: #B8913A; text-decoration: none;">${phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #9A9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Project</td>
          <td style="padding: 10px 0; color: #F5F0E8; font-size: 14px;">${projectType || '—'}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #9A9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; vertical-align: top;">Budget</td>
          <td style="padding: 10px 0; color: #F5F0E8; font-size: 14px;">${budget || '—'}</td>
        </tr>
        ${message ? `
        <tr>
          <td colspan="2" style="padding: 16px 0 4px; color: #9A9488; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 4px 0 10px; color: #F5F0E8; font-size: 14px; line-height: 1.7; background: rgba(245,240,232,0.04); padding: 16px; border: 0.5px solid rgba(245,240,232,0.08);">${message}</td>
        </tr>
        ` : ''}
      </table>
      <hr style="border: none; border-top: 0.5px solid rgba(184,145,58,0.3); margin: 28px 0 16px;" />
      <p style="font-size: 10px; color: #9A9488; letter-spacing: 0.1em;">This email was sent from the A Square Homes website contact form.</p>
    </div>
  `;

  const { data: result, error } = await resend.emails.send({
    from:    process.env.FROM_EMAIL || 'A Square Homes <onboarding@resend.dev>',
    to:      [process.env.TO_EMAIL],
    subject: `New Enquiry from ${name} — ${projectType || 'General'}`,
    html:    htmlBody,
    replyTo: email
  });

  if (error) {
    throw new Error(error.message || 'Resend API error');
  }

  return result;
}

module.exports = sendContactEmail;
