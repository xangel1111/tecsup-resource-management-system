const nodemailer = require('nodemailer');

async function sendMail(to, subject, message) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // ejemplo: tuapp@gmail.com
        pass: process.env.GMAIL_PASS, // contraseña de aplicación
      },
    });

    const mailOptions = {
      from: `"Sistema de Reservas Tecsup" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo enviado a ${to}`);
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
}

module.exports = { sendMail };
