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

    const prompt = `You are a smart AI travel planner for "Gilgit Adventure Treks", a travel and tourism company based in Gilgit, Pakistan specializing in Northern Pakistan tours.

Traveler Request:
- Budget: ${budget}
- Trip Duration: ${duration}
- Interests: ${interests?.join(', ') || 'General sightseeing'}
- Travel Style: ${style}

Create a detailed, personalized travel itinerary. ALWAYS recommend from our REAL tour packages first, then add standalone destinations as day-trips if relevant.

OUR TOUR PACKAGES (recommend these first):

1. **Blossom Jeep Safari** — 10 Days, $600–650/person (PKR ~85,000)
   Season: Spring (March–April) | Difficulty: Easy | Group: 6–15
   Route: Islamabad → Fairy Meadows → Hunza → Khunjerab Pass → Gupis → Phandar → Islamabad
   Includes: Transport, hotels, all meals, guide, permits

2. **K2 Base Camp & Gondogoro La Trek** — 18–21 Days, $2,350/person (PKR ~350,000)
   Season: Summer (June–August) | Difficulty: Extreme | Group: 4–12
   Route: Islamabad → Skardu → Askole → Concordia → K2 BC → Gondogoro La → Hushe → Islamabad
   Includes: Flights, camping gear, porters, climbing equipment, permits

3. **Autumn Colors Tour** — 11 Days, $680–750/person (PKR ~95,000)
   Season: Autumn (Oct–Nov) | Difficulty: Easy | Group: 6–15
   Route: Islamabad → Skardu (flight) → Hunza → Khunjerab → Fairy Meadows → Naran → Islamabad
   Includes: Skardu flight, transport, hotels, all meals, guide

4. **Summer Trekking & Tour** — 12 Days, $700–800/person (PKR ~100,000)
   Season: Summer (June–August) | Difficulty: Challenging | Group: 4–12
   Route: Islamabad → Nanga Parbat Rupal Face → Hunza → Khunjerab → Hoper → Islamabad
   Includes: Transport, camping gear, porters, all meals, guide

5. **October Explorer Tour** — 11 Days, $650–780/person (PKR ~90,000)
   Season: October | Difficulty: Easy | Group: 6–15
   Route: Islamabad → Skardu (flight) → Khaplu → Fairy Meadows → Hunza → Naltar → Naran → Islamabad
   Includes: Skardu flight, transport, hotels, all meals, guide

STANDALONE DESTINATIONS (can be added as extensions):
- Naltar Valley — PKR 40,000 (3 days)
- Deosai National Park — PKR 30,000 (2 days)
- Attabad Lake & Passu — PKR 38,000 (2 days)

Based on the traveler's budget, duration, and interests, recommend the best matching tour package. Include:
1. A catchy trip title
2. Which tour package best fits (with real price)
3. Day-by-day itinerary highlights
4. What's included and what to bring
5. Best time to visit
6. Packing essentials and travel tips

Keep the response well-structured (use ** for bold headings), informative, and exciting. Around 400-500 words. Use both USD and PKR prices. Add relevant emojis to make it engaging.`;

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

    const systemContext = `You are a friendly AI travel assistant for "Gilgit Adventure Treks", a travel company based in Gilgit, Pakistan specializing in Northern Pakistan tours.

OUR TOUR PACKAGES:
1. Blossom Jeep Safari — 10 Days, $600–650/person, Spring, Easy
2. K2 Base Camp & Gondogoro La Trek — 18–21 Days, $2,350/person, Summer, Extreme
3. Autumn Colors Tour — 11 Days, $680–750/person, Oct–Nov, Easy
4. Summer Trekking & Tour — 12 Days, $700–800/person, Jun–Aug, Challenging
5. October Explorer Tour — 11 Days, $650–780/person, October, Easy

STANDALONE: Naltar Valley (PKR 40,000), Deosai National Park (PKR 30,000), Attabad Lake & Passu (PKR 38,000)

Keep responses concise (2-3 sentences), friendly, and helpful. Share actual prices when asked. Recommend specific packages based on the traveler's interests.`;

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
