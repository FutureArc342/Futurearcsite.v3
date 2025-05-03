// controllers/faqController.js
const Faq = require('../models/faqModels');  // Importera FAQ-modellen

// Hämta alla FAQ-poster
exports.getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);  // skicka tillbaka listan av FAQs som JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
};

// Skapa en ny FAQ-post
exports.createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    // Validering av indata
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    const newFaq = new Faq({ question, answer });
    await newFaq.save();  // spara i databasen
    res.status(201).json({ message: 'FAQ created successfully', faq: newFaq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
};

// Uppdatera en befintlig FAQ-post
exports.updateFaq = async (req, res) => {
  try {
    const faqId = req.params.id;
    const { question, answer } = req.body;
    // Validera att båda fält finns
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    const updatedFaq = await Faq.findByIdAndUpdate(
      faqId,
      { question, answer },
      { new: true }  // returnera den uppdaterade posten
    );
    if (!updatedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json({ message: 'FAQ updated', faq: updatedFaq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
};

// (Valfritt) Ta bort en FAQ-post
exports.deleteFaq = async (req, res) => {
  try {
    const faqId = req.params.id;
    const deletedFaq = await Faq.findByIdAndDelete(faqId);
    if (!deletedFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
};