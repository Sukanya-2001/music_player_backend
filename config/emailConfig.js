const nodemailer = require("nodemailer");

// Replace with your AWS SES SMTP credentials
const transporter = nodemailer.createTransport({
  host: "email-smtp.eu-north-1.amazonaws.com", // Change to your AWS region's SMTP host
  port: 587, // Use 465 for SSL, 587 for TLS
  secure: false, // true for 465, false for 587
  auth: {
    user: "AKIAU5LH5OSV6S6DKQPP",
    pass: "BAg3UH94vyPXEJpREzaAcOl4g1crglRhW8XTza/xwF4D",
  },
});

// Function to send an email
async function sendEmail() {
  try {
    const info = await transporter.sendMail({
      from: "somgorai726@gmail.com", // Must be the verified email or domain
      to: "sukanyasett2018@gmail.com", // Replace with recipient's email
      subject: "Hello from AWS SES!",
      text: "This is a test email sent via AWS SES SMTP and Node.js.",
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports=sendEmail;

