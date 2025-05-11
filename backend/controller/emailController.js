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
      service: "gmail", // Use your email service (e.g., Gmail, Outlook, etc.)
      auth: {
        user: process.env.email, // Replace with your email
        pass: process.env.password, // Replace with your email password or app-specific password
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