const nodemailer = require('nodemailer');

let transporter;

function smtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.SMTP_FROM
  );
}

function transport() {
  if (!smtpConfigured()) throw new Error('SMTP is not fully configured');
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT);
    const secure = String(process.env.SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    });
  }
  return transporter;
}

function sender() {
  const name = process.env.SMTP_FROM_NAME || 'FCA Executive Leadership Coaching';
  return '"' + name.replace(/"/g, '') + '" <' + process.env.SMTP_FROM + '>';
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[char]));
}

async function sendMail({ to, subject, text, html }) {
  if (!to) throw new Error('Recipient email is missing');
  return transport().sendMail({ from: sender(), to, subject, text, html });
}

async function sendSignupConfirmation({ to, confirmationUrl, code }) {
  const detail = confirmationUrl ? 'Confirm your email: ' + confirmationUrl : 'Your confirmation code is: ' + code;
  return sendMail({
    to,
    subject: 'Confirm your Executive Leadership Coaching access',
    text: 'Welcome to the Executive Leadership Coaching Portal.\n\n' + detail + '\n\nFoundations Counselling Academy',
    html: '<p>Welcome to the Executive Leadership Coaching Portal.</p>' +
      (confirmationUrl
        ? '<p><a href="' + escapeHtml(confirmationUrl) + '">Confirm your email and continue</a></p>'
        : '<p>Your confirmation code is: <strong>' + escapeHtml(code) + '</strong></p>') +
      '<p>Foundations Counselling Academy</p>'
  });
}

async function sendMilestoneAccessToken({ to, participantName, completedTitle, nextTitle, token }) {
  const name = participantName || 'Participant';
  const subject = 'Your Executive Leadership Milestone Has Been Unlocked';
  const text =
    'Congratulations ' + name + ',\n\n' +
    'You have successfully completed:\n' + completedTitle + '\n\n' +
    'Your next milestone is now available:\n' + nextTitle + '\n\n' +
    'Your access credential is:\n' + token + '\n\n' +
    'Please keep this credential secure.\n\n' +
    'Executive Leadership Coaching Portal\nFoundations Counselling Academy';
  const html =
    '<p>Congratulations ' + escapeHtml(name) + ',</p>' +
    '<p>You have successfully completed:</p><p><strong>' + escapeHtml(completedTitle) + '</strong></p>' +
    '<p>Your next milestone is now available:</p><p><strong>' + escapeHtml(nextTitle) + '</strong></p>' +
    '<p>Your access credential is:</p><p style="font-size:20px;font-weight:700;letter-spacing:.08em">' + escapeHtml(token) + '</p>' +
    '<p>Please keep this credential secure.</p><p>Executive Leadership Coaching Portal<br>Foundations Counselling Academy</p>';
  return sendMail({ to, subject, text, html });
}

async function sendAssessmentResult({ to, participantName, message }) {
  return sendMail({
    to,
    subject: 'Your Executive Leadership Assessment Update',
    text: (participantName || 'Participant') + ',\n\n' + message,
    html: '<p>' + escapeHtml(participantName || 'Participant') + ',</p><p>' + escapeHtml(message) + '</p>'
  });
}

async function sendProgrammeCompletion({ to, participantName }) {
  return sendMail({
    to,
    subject: 'Executive Leadership Programme Completed',
    text: 'Congratulations ' + (participantName || 'Participant') + '. You have completed the Executive Leadership Coaching Programme.',
    html: '<p>Congratulations ' + escapeHtml(participantName || 'Participant') + '.</p><p>You have completed the Executive Leadership Coaching Programme.</p>'
  });
}

module.exports = {
  smtpConfigured,
  sendSignupConfirmation,
  sendMilestoneAccessToken,
  sendAssessmentResult,
  sendProgrammeCompletion
};
