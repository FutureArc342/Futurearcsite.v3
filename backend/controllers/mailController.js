const nodemailer = require('nodemailer');

exports.sendContactMail = async (req, res) => {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // mail till dig
        subject: `Nytt meddelande från ${name}`,
        text: `Namn: ${name}\nE-post: ${email}\nMeddelande: ${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Meddelande skickat framgångsrikt!" });
    } catch (error) {
        res.status(500).json({ message: "Fel vid skickandet av mejlet.", error: error.message });
    }
};