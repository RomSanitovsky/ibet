const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fsdprojects2020@gmail.com',
      pass: 'eliav123',
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Ibet <fsdprojects2020@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
