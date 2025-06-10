const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // ✅ true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.BASE_URL}/api/verify?token=${token}`;
  await transporter.sendMail({
    from: `"Sherubtse Registration" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification",
    html: `<p>Hi there,<br><br>Please verify your email by clicking the link below:</p>
           <a href="${url}">Verify Email</a>
           <p>If you did not sign up, you can ignore this message.</p>`,
  });
};

module.exports = sendVerificationEmail;
