const nodemailer = require('nodemailer');

exports.submitContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // E-post till dig själv
    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `Nytt meddelande från ${name}`,
      text: message,
    });

    // Bekräftelse till användaren
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tack för ditt meddelande!',
      text: 'Vi har mottagit ditt meddelande och återkommer så snart vi kan.',
    });

    res.status(200).json({ message: 'Meddelande skickat!' });
  } catch (error) {
    console.error('Fel vid e-postsändning:', error);
    res.status(500).json({ error: 'Ett fel uppstod vid sändning av meddelandet.' });
  }
};