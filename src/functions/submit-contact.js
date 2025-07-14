require('dotenv').config({ path: './src/.env' });  // Load .env automatically, place .env at your project root or backend folder

const { Client } = require('pg');
const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: 'Invalid JSON' };
  }

  const { name, email, message } = data;
  if (!name || !email || !message) {
    return { statusCode: 400, body: 'Missing required fields' };
  }

  // Debug: print DB connection string to verify correct loading
  console.log("Using DB URL:", process.env.NEON_DB_URL);

  const client = new Client({
    connectionString: process.env.NEON_DB_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Connect to the database
    await client.connect();

    // Insert the form data into the contact_messages table
    await client.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    );

    // Prepare nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      text: `You received a new message from your contact form:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    // Send email to admin
    await transporter.sendMail(mailOptions);

    await client.end();

    // Success response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully!' })
    };

  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error occurred' })
    };
  }
};
