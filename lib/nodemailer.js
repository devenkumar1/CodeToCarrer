import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service : "gmail", // true for port 465, false for other ports
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

export default transporter;