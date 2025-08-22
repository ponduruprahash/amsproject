const express = require('express');
const router = express.Router();

// FAQ data - can be moved to database later
const faqData = {
  'admission dates': {
    answer: "Admissions are open throughout the year! We accept applications for the current academic year and early applications for the next year. For the best chance of securing a spot, we recommend applying 3-6 months in advance.",
    keywords: ['admission', 'dates', 'when', 'open', 'apply', 'deadline']
  },
  'fee structure': {
    answer: "Our fee structure varies by grade level. Here's a general overview:\n\n• Kindergarten: ₹45,000 per year\n• Grades 1-3: ₹52,000 per year\n• Grades 4-5: ₹58,000 per year\n• Grades 6-7: ₹65,000 per year\n\nFees include tuition, books, and basic supplies. For detailed fee breakdown, please contact us at admissions@alphamodels.in",
    keywords: ['fee', 'fees', 'cost', 'price', 'tuition', 'payment', 'structure']
  },
  'location': {
    answer: "Alpha Model's International School is located at:\n\nPlot no: 395, Road no: 06, Raghavendra Colony\nBeeramguda, Telangana 502032\n\n📍 Google Maps: https://maps.google.com/?q=Alpha+Model+School+Beeramguda\n\nWe're easily accessible from major areas in Hyderabad.",
    keywords: ['location', 'address', 'where', 'place', 'directions', 'map']
  },
  'contact': {
    answer: "You can reach us through multiple channels:\n\n📧 Admissions: admissions@alphamodels.in\n📧 General Enquiries: enquiry@alphamodels.in\n📧 HR/Jobs: hr@alphamodels.in\n📱 Phone: 9949128732\n\nWe typically respond within 24 hours during business days.",
    keywords: ['contact', 'phone', 'email', 'call', 'reach', 'number']
  },
  'grades': {
    answer: "We offer education from Kindergarten to Grade 7:\n\n• Kindergarten (KG)\n• Primary: Grades 1-5\n• Middle: Grades 6-7\n\nWe follow the CBSE curriculum with international standards and modern teaching methodologies.",
    keywords: ['grade', 'grades', 'class', 'level', 'curriculum', 'cbse']
  },
  'facilities': {
    answer: "Our school offers world-class facilities:\n\n🏫 Modern classrooms with smart boards\n🏃‍♂️ Sports facilities (indoor & outdoor)\n🎨 Art & music rooms\n💻 Computer labs\n📚 Well-stocked library\n🏥 Medical room\n🚌 Transportation services\n🍽️ Cafeteria with healthy meals",
    keywords: ['facilities', 'infrastructure', 'classroom', 'sports', 'library', 'transport']
  },
  'admission process': {
    answer: "Our admission process is simple:\n\n1️⃣ Fill out the online application form\n2️⃣ Submit required documents\n3️⃣ Schedule an interaction session\n4️⃣ Receive admission decision\n5️⃣ Complete enrollment formalities\n\nRequired documents: Birth certificate, previous school records, address proof, and parent ID proof.",
    keywords: ['process', 'procedure', 'steps', 'documents', 'required', 'application']
  }
};

// Helper function to find best matching FAQ
function findBestMatch(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Direct keyword matching
  for (const [key, data] of Object.entries(faqData)) {
    if (message.includes(key)) {
      return { question: key, ...data };
    }
  }
  
  // Keyword matching
  for (const [key, data] of Object.entries(faqData)) {
    for (const keyword of data.keywords) {
      if (message.includes(keyword)) {
        return { question: key, ...data };
      }
    }
  }
  
  return null;
}

// POST /api/chatbot - Handle chatbot messages
router.post('/', (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        ok: false,
        error: 'Message is required'
      });
    }

    const match = findBestMatch(message);
    
    if (match) {
      res.json({
        ok: true,
        answer: match.answer,
        question: match.question
      });
    } else {
      res.json({
        ok: true,
        answer: "Thank you for your question! I'm here to help with information about admissions, fees, location, and contact details. Could you please rephrase your question or contact us directly at admissions@alphamodels.in for specific assistance?",
        question: 'general'
      });
    }

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to process message'
    });
  }
});

// GET /api/chatbot/faqs - Get all FAQs (for admin)
router.get('/faqs', (req, res) => {
  try {
    const faqs = Object.entries(faqData).map(([key, data]) => ({
      question: key,
      answer: data.answer,
      keywords: data.keywords
    }));
    
    res.json({
      ok: true,
      faqs
    });
  } catch (error) {
    console.error('FAQ fetch error:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch FAQs'
    });
  }
});

module.exports = router;
