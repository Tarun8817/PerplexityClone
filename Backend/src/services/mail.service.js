import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter
  .verify()
  .then(() => console.log("Email server is ready to send messages"))
  .catch((error) => console.error("Error connecting to email server:", error));

/**
 * @function sendEmail
 * @desc     Send an email using the configured transporter
 * @param {string} to      - Recipient email address
 * @param {string} subject - Email subject line
 * @param {string} html    - Email body in HTML format
 */
export async function sendEmail({ to, subject, html }) {
  try {
    const mailOptions = {
      from: process.env.GOOGLE_USER, 
      to,
      subject,
      html,                        
    };

    const details = await transporter.sendMail(mailOptions); 
    console.log("Email sent:", details.messageId);
    return details;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export default transporter;