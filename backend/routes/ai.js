const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// POST /api/ai/plan - Generate trip/project plan
router.post('/plan', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(503).json({ message: 'AI service not configured' });
    }

    const { budget, duration, interests, style } = req.body;

    const prompt = `You are an AI assistant for Gilgit Adventure Treks, a production company in Pakistan.

Client Request:
- Budget: ${budget}
- Timeline: ${duration}
- Project Type: ${interests?.join(', ') || 'General'}
- Client Type: ${style}

Please create a detailed project proposal including:
1. Recommended Production Package
2. Estimated Timeline & Deliverables
3. Team & Equipment Recommendations
4. Budget Breakdown
5. Next Steps

Keep it concise (300-400 words), professional, and tailored to their needs.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ plan: text });
  } catch (err) {
    console.error('AI plan generation error:', err.message);
    res.status(500).json({ message: 'Failed to generate plan', error: err.message });
  }
});

// POST /api/ai/chat - Chat with AI assistant
router.post('/chat', async (req, res) => {
  try {
    if (!genAI) {
      return res.status(503).json({ message: 'AI service not configured' });
    }

    const { message, context } = req.body;

    const systemContext = `You are a helpful AI assistant for Gilgit Adventure Treks, a production company in Pakistan.
We offer: Wedding Films, Corporate Videos, Music Videos, Event Coverage, Documentary Production, Photography, Commercial Ads, and Branding.
Our packages range from PKR 30,000 to 200,000+. We serve Gilgit-Baltistan and surrounding regions.

Keep responses concise (2-3 sentences), friendly, and helpful. If asked about pricing, mention our packages. If asked about services, highlight our expertise.`;

    const fullPrompt = `${systemContext}\n\nUser: ${message}\n\nAssistant:`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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
