import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ContactPayload = {
  name?: string;
  email?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message?: string;
};

type ContactEmailData = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  message: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[+\d\s()-]{7,20}$/.test(phone);
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

async function sendContactEmail({
  name,
  email,
  phone,
  projectType,
  budget,
  message
}: ContactEmailData): Promise<void> {
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

  const { error } = await resend.emails.send({
    from: process.env.FROM_EMAIL || 'A Square Homes <onboarding@resend.dev>',
    to: [process.env.TO_EMAIL || ''],
    subject: `New Enquiry from ${name} — ${projectType || 'General'}`,
    html: htmlBody,
    replyTo: email
  });

  if (error) {
    throw new Error(error.message || 'Resend API error');
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'Missing RESEND_API_KEY environment variable.' },
        { status: 500 }
      );
    }

    if (!process.env.TO_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Missing TO_EMAIL environment variable.' },
        { status: 500 }
      );
    }

    const body = (await request.json().catch(() => null)) as ContactPayload | null;

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body.' },
        { status: 400 }
      );
    }

    const name = normalizeText(body.name);
    const email = normalizeText(body.email);
    const phone = normalizeText(body.phone);
    const projectType = normalizeText(body.projectType);
    const budget = normalizeText(body.budget);
    const message = normalizeText(body.message);

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required.' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name is too long.' },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required.' },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid phone number.' },
        { status: 400 }
      );
    }

    if (projectType && !['New Home', 'Renovation', 'Commercial Space', 'Styling Only'].includes(projectType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project type.' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Message is too long (max 2000 characters).' },
        { status: 400 }
      );
    }

    await sendContactEmail({ name, email, phone, projectType, budget, message });

    console.log(`✓ Enquiry received from ${name} <${email}>`);

    return NextResponse.json(
      { success: true, message: "Thank you — we'll be in touch within 24 hours." },
      { status: 200 }
    );
  } catch (error) {
    console.error('✗ Email send failed:', error instanceof Error ? error.message : error);

    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}