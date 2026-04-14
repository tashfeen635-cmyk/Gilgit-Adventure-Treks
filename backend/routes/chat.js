const express = require('express');
const router = express.Router();

const SYSTEM_PROMPT = `You are a friendly chat assistant for "Gilgit Adventure Treks", a travel and tourism company based in Gilgit, Pakistan specializing in Northern Pakistan tours.

OUR TOUR PACKAGES:
1. Blossom Jeep Safari — 10 Days, $600–650/person, Spring (Mar–Apr), Easy
   Route: Islamabad → Fairy Meadows → Hunza → Khunjerab Pass → Gupis → Islamabad
2. K2 Base Camp & Gondogoro La Trek — 18–21 Days, $2,350/person, Summer (Jun–Aug), Extreme
   Route: Islamabad → Skardu → Askole → Concordia → K2 BC → Gondogoro La → Hushe → Islamabad
3. Autumn Colors Tour — 11 Days, $680–750/person, Oct–Nov, Easy
   Route: Islamabad → Skardu (flight) → Hunza → Khunjerab → Fairy Meadows → Naran → Islamabad
4. Summer Trekking & Tour — 12 Days, $700–800/person, Jun–Aug, Challenging
   Route: Islamabad → Nanga Parbat Rupal Face → Hunza → Khunjerab → Hoper → Islamabad
5. October Explorer Tour — 11 Days, $650–780/person, October, Easy
   Route: Islamabad → Skardu (flight) → Khaplu → Fairy Meadows → Hunza → Naltar → Naran → Islamabad

JEEP SAFARI PLANS:
6. Deosai Plains Jeep Safari — 7 Days, $500–550/person, Jun–Sep, Easy
7. Fairy Meadows Jeep Safari — 6 Days, $420–480/person, May–Oct, Moderate
8. Shandur Pass Jeep Safari — 8 Days, $550–620/person, Jun–Sep, Moderate
9. Khunjerab Pass Jeep Safari — 7 Days, $520–580/person, Apr–Oct, Easy
10. Shimshal Valley Jeep Safari — 9 Days, $600–680/person, Jun–Sep, Moderate
11. Hushe Valley Jeep Safari — 9 Days, $620–700/person, Jun–Sep, Moderate

STANDALONE DESTINATIONS: Naltar Valley (PKR 40,000), Deosai National Park (PKR 30,000), Attabad Lake & Passu (PKR 38,000)

STRICT RULES:
- Keep replies SHORT — 1-2 sentences max. Never write long paragraphs.
- Match the user's energy. If they say "hello", just say hello back briefly. Do NOT dump information they didn't ask for.
- Only give details when the user ASKS a specific question.
- Only greet with "Assalam o Alaikum" on the FIRST message. Never repeat it.
- No markdown formatting (no ** or ##). Plain text only.
- When asked about pricing, share actual package prices from above. Be transparent.
- Do not list all packages unless asked. Recommend the best match for the user's interests.

Examples of good replies:
User: "hello" → "Assalam o Alaikum! How can I help you plan your Northern Pakistan adventure?"
User: "what tours do you offer?" → "We have 11 tour packages from $420 to $2,350 — jeep safaris, spring blossom tours, autumn color tours, summer treks, and the legendary K2 Base Camp expedition. What season are you thinking?"
User: "how much does the autumn tour cost?" → "The Autumn Colors Tour is 11 days at $680–750 per person. It includes a Skardu flight, all meals, transport, and hotels."
User: "I want something challenging" → "Our Summer Trekking & Tour is 12 days at $700–800/person — you'll trek to Nanga Parbat's Rupal Face and cross Khunjerab Pass. For the ultimate challenge, the K2 Base Camp trek is $2,350/person."
User: "do you have easy tours?" → "Yes! The Fairy Meadows Safari ($420), Deosai Plains Safari ($500), Khunjerab Pass Safari ($520), Blossom Jeep Safari ($600), Autumn Colors Tour ($680), and October Explorer ($650) are all rated Easy or Moderate — great for all experience levels."`;

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
