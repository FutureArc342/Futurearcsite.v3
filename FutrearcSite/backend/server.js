const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
console.log("🛠 Server.js startar...");

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP-konfigurationsfel:", error);
  } else {
    console.log("📬 SMTP-anslutning klar");
  }
});
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

// Importera din modell
const Contact = require('./models/contactModel');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// Anslut till MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// Route
app.post('/api/mail/sendmail', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    // Notify site owner
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: ADMIN_EMAIL,
      subject: `Nytt meddelande från ${name}`,
      text: `Du har mottagit ett nytt meddelande:\n\nNamn: ${name}\nE-post: ${email}\nMeddelande:\n${message}`
    });

    // Confirmation to user
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Tack för ditt meddelande',
      text: `Hej ${name},\n\nTack för att du kontaktade oss. Vi återkommer till dig snart!\n\nVänliga hälsningar,\nFutureArc-teamet`
    });

    console.log("✅ Meddelande sparat:", newMessage);
    res.status(200).json({ message: "Meddelandet mottaget och sparat!" });
  } catch (error) {
    console.error("❌ Fel vid sparning:", error);
    res.status(500).json({ message: "Serverfel. Försök igen senare." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servern körs på port ${PORT}`);
});