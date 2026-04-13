const express = require('express');
const router = express.Router();

const SYSTEM_PROMPT = `You are a friendly chat assistant for "Gilgit Adventure Treks", a travel and tourism company operating across ALL of Pakistan.

COMPANY COVERAGE:
- We work in ALL provinces: Sindh (Karachi), Punjab (Lahore, Islamabad), KPK (Swat, Peshawar), and Gilgit-Baltistan.
- Our SPECIALTY is Gilgit-Baltistan tourism, but we also arrange tours across Pakistan.
- Think of us as Pakistan's comprehensive travel company with expertise in northern regions.

STRICT RULES:
- Keep replies SHORT — 1-2 sentences max. Never write long paragraphs.
- Match the user's energy. If they say "hello", just say hello back briefly. Do NOT dump information they didn't ask for.
- Only give details when the user ASKS a specific question.
- Only greet with "Assalam o Alaikum" on the FIRST message. Never repeat it.
- NEVER mention Hunza.
- No markdown formatting (no ** or ##). Plain text only.
- NEVER mention prices or costs. If asked about pricing, say "Please contact us for customized pricing and packages."
- Do not list destinations unless asked about destinations.

OUR DESTINATIONS:
- Gilgit-Baltistan: Gilgit, Skardu, Fairy Meadows, K2, Naltar, Deosai, Khunjerab Pass, Passu
- KPK: Swat, Peshawar, Naran, Kaghan
- Punjab: Lahore, Islamabad, Murree
- Sindh: Karachi, Hyderabad

Examples of good replies:
User: "hello" → "Assalam o Alaikum! How can I help you plan your trip?"
User: "what is gilgit adventure treks?" → "We're a travel company operating across all of Pakistan — from Karachi to K2. Our specialty is Gilgit-Baltistan, but we arrange tours everywhere in Pakistan."
User: "what trips do you offer?" → "We offer tours across Pakistan — Sindh, Punjab, KPK, and our specialty Gilgit-Baltistan. Which region interests you?"
User: "do you work in karachi?" → "Yes! We arrange tours from Karachi and across Sindh, plus all of Pakistan."
User: "how much does it cost?" → "Please contact us for customized pricing and packages. We'll create the perfect itinerary for your budget!"`;

const chatHistory = new Map();

function getChatId(req) {
  return req.ip || 'default';
}

// Test endpoint
router.get('/test', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return res.json({ status: 'FAIL', reason: 'GROQ_API_KEY not set' });
  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'say hi in one sentence' }],
        max_tokens: 50
      })
    });
    const data = await resp.json();
    if (!resp.ok) return res.json({ status: 'FAIL', reason: 'API error', details: data });
    res.json({ status: 'OK', reply: data.choices?.[0]?.message?.content });
  } catch (err) {
    res.json({ status: 'FAIL', reason: err.message });
  }
});

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: 'AI service not configured' });
  }

  try {
    const chatId = getChatId(req);
    if (!chatHistory.has(chatId)) {
      chatHistory.set(chatId, []);
    }
    const history = chatHistory.get(chatId);

    history.push({ role: 'user', content: message.trim() });

    // Keep only last 10 exchanges to save tokens
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...history
        ],
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    if (!aiText) {
      throw new Error('No response from AI');
    }

    history.push({ role: 'assistant', content: aiText });

    res.json({ reply: aiText });
  } catch (err) {
    console.error('Chat AI error:', err.message);
    res.status(500).json({ error: 'AI unavailable' });
  }
});

// Clean up old chat histories every 30 minutes
setInterval(() => {
  chatHistory.clear();
}, 30 * 60 * 1000);

module.exports = router;
