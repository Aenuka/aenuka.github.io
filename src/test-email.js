require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "Test Email from Nodemailer",
      text: "This is a test email to verify SMTP credentials.",
    });
    console.log("Test email sent:", info.response);
  } catch (err) {
    console.error("Test email failed:", err);
  }
}

testEmail();
