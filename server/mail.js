// server/mail.js
// Sends mail through the Resend HTTP API (https://resend.com/docs/api-reference/emails/send-email).
// Needs RESEND_API_KEY and MAIL_FROM (an address on a domain verified in Resend) in server/.env.

const isMailConfigured = () => Boolean(process.env.RESEND_API_KEY && process.env.MAIL_FROM);

async function sendMail({ to, subject, text }) {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: process.env.MAIL_FROM, to: [to], subject, text }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

module.exports = { isMailConfigured, sendMail };
