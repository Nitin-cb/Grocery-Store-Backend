const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to send email
app.post('/send-email', upload.single('resume'), (req, res) => {
  const { name, email, phone, position } = req.body;
  const file = req.file;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'hr@almadinauae.ae',
    subject: `Job Application from ${name}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Position: ${position}
    `,
    attachments: [
      {
        filename: file.originalname,
        content: file.buffer,
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending email:', err);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    res.status(200).json({ message: 'Email sent successfully', info });
  });
});

// Start server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
