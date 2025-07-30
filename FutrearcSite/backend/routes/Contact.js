const { supabase } = require('../supabaseClient');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Received values:", { name, email, message });

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Alla fält krävs.' });
  }

  try {
    // Save to Supabase
    const { error: dbError } = await supabase
      .from('contact_messages') // se till att endast denna tabell används i Supabase
      .insert([{ name, email, message }]);

    if (dbError) throw dbError;

    // Send mail to admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'Nytt meddelande från Futurearc-webbplatsen',
      text: `Från: ${name}\nEmail: ${email}\n\n${message}`
    });

    // Send confirmation to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Futurearc – Meddelande mottaget',
      text: `Hej ${name},\n\nVi har tagit emot ditt meddelande:\n\n"${message}"\n\nVi återkommer så snart vi kan.\n\n/ Team Futurearc`
    });

    res.status(200).json({ message: 'Tack! Ditt meddelande har skickats.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ett fel uppstod. Försök igen senare.' });
  }
});

module.exports = router;