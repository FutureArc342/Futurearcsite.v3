const express = require('express');
const cors = require('cors');
require('dotenv').config();
const nodemailer = require('nodemailer');
console.log("🛠 Server.js startar...");

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Allow both origins
  methods: ['GET', 'POST', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Content-Type'],
}));

// Handle preflight requests
app.options('*', cors());

// Route
app.post('/api/mail/sendmail', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Detailed logging
    console.log(`\n--- Incoming Request ---`);
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log(`Origin: ${req.headers.origin}`);
    console.log('Body:', { name, email, message });
    console.log(`------------------------\n`);

    if (!name || !email || !message) {
      console.error("❌ Validation error: Missing fields.");
      return res.status(400).json({ ok: false, error: "Namn, e-post och meddelande krävs." });
    }

    console.log('📩 Storing message in Supabase:', { name, email, message });
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(500).json({ ok: false, error: "Serverfel vid lagring." });
    } else {
      // Konfigurera Nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailToAdmin = {
        from: process.env.EMAIL_USER,
        to: 'futurearc451@gmail.com',
        subject: 'Nytt meddelande från kontaktformulär',
        text: `Namn: ${name}\nEmail: ${email}\nMeddelande: ${message}`
      };

      const mailToUser = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Tack för ditt meddelande!',
        text: `Hej ${name},\n\nTack för att du kontaktade Futurearc. Vi återkommer till dig så snart som möjligt.\n\nDitt meddelande:\n"${message}"`
      };

      try {
        await transporter.sendMail(mailToAdmin);
        await transporter.sendMail(mailToUser);
        console.log("📧 Emails sent successfully!");
      } catch (emailError) {
        console.error("❌ Fel vid e-postskickning:", emailError);
        // It's crucial to return here to prevent further execution if email sending fails
        return res.status(500).json({ ok: false, error: "Meddelande sparades men e-post kunde inte skickas." });
      }
    }

    console.log("✅ Meddelande sparat i Supabase:", JSON.stringify(data, null, 2));
    res.status(200).json({ ok: true, message: "Tack! Ditt meddelande har skickats." });
  } catch (error) {
    console.error("❌ Fel vid sparning:", error);
    res.status(500).json({ ok: false, error: "Serverfel. Försök igen senare." });
  }
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servern körs på port ${PORT}`);
});