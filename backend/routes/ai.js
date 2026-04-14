const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// POST /api/ai/plan - Generate AI trip itinerary
router.post('/plan', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(503).json({ message: 'AI service not configured' });
    }

    const { budget, duration, interests, style } = req.body;

    const prompt = `You are a smart AI travel planner for "Gilgit Adventure Treks", a travel and tourism company based in Gilgit, Pakistan. We arrange tours across ALL of Pakistan — from Karachi to K2.

Traveler Request:
- Budget: ${budget}
- Trip Duration: ${duration}
- Interests: ${interests?.join(', ') || 'General sightseeing'}
- Travel Style: ${style}

Create a detailed, personalized travel itinerary. Include:
1. A catchy trip title
2. Day-by-day itinerary with specific places, activities, and travel tips
3. Recommended accommodations (budget-appropriate)
4. Estimated cost breakdown in PKR
5. Packing essentials and travel tips
6. Best time to visit these places

Our destinations include:
- Gilgit-Baltistan: Gilgit Valley, Skardu, Fairy Meadows, K2 Base Camp, Naltar Valley, Deosai, Khunjerab Pass, Passu, Attabad Lake
- KPK: Swat Valley, Peshawar, Naran, Kaghan
- Punjab: Lahore, Islamabad, Murree
- Sindh: Karachi, Hyderabad

Keep the response well-structured (use ** for bold headings), informative, and exciting. Around 400-500 words. Use PKR for all prices. Add relevant emojis to make it engaging.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ plan: text });
  } catch (err) {
    console.error('AI plan generation error:', err.message);
    res.status(500).json({ message: 'Failed to generate plan', error: err.message });
  }
});

// POST /api/ai/chat - Chat with AI assistant (Gemini fallback)
router.post('/chat', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(503).json({ message: 'AI service not configured' });
    }

    const { message } = req.body;

    const systemContext = `You are a friendly AI travel assistant for "Gilgit Adventure Treks", a travel and tourism company operating across ALL of Pakistan.
We offer tours to: Gilgit-Baltistan (Gilgit, Skardu, Fairy Meadows, K2, Naltar, Deosai, Khunjerab Pass, Passu), KPK (Swat, Peshawar, Naran), Punjab (Lahore, Islamabad, Murree), Sindh (Karachi).
Budget tours from PKR 30,000 to premium packages PKR 150,000+.

Keep responses concise (2-3 sentences), friendly, and helpful. If asked about pricing, mention our packages. If asked about destinations, highlight the best spots.`;

    const fullPrompt = `${systemContext}\n\nUser: ${message}\n\nAssistant:`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.status(500).json({ message: 'Failed to get response', error: err.message });
  }
});

module.exports = router;
