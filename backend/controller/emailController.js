const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmail = async (req, res) => {
  const { subject, body} = req.body;


  if (!subject || !body) {
    return res.status(400).json({ error: "Subject and body are required" });
  }

  try {
   
    // Configure the email transporter
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587, // Use 465 for SSL or 587 for TLS
  secure: false, // Set to true for port 465
  auth: {
    user: process.env.email, // Your Gmail address
    pass: process.env.password, // Your Gmail app-specific password
  },
});

    // Email options
    const mailOptions = {
      from: process.env.email, // Sender's email
      to: process.env.email, // Replace with the recipient's email
      subject: subject,
      text: JSON.stringify(body, null, 2),
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

module.exports = { sendEmail };