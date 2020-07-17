const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'Comissão SCTI 2020 <scti@uenf.br>',
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  await transport.sendMail(mailOptions);
};

module.exports = sendEmail;
