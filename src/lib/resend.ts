import { Resend } from 'resend';

// Initialize Resend client and validate API key presence for clearer errors
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  // Surface a clear runtime warning in dev/test; production logs too
  console.warn('RESEND_API_KEY is not set. Email sending will fail.');
}

export const resend = new Resend(apiKey);
