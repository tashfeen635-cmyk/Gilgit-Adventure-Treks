const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

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
User: "how much does the autumn tour cost?" → "The Autumn Colors Tour is 11 days at $680–750 per person. It includes a Skardu flight, all meals, transport, and hotels."`;

// Keyword-based fallback responses when AI API is unavailable
const fallbackResponses = {
  hello: 'Assalam o Alaikum! Welcome to Gilgit Adventure Treks. We have 11 tour packages from $420 to $2,350. What kind of adventure are you looking for?',
  hi: 'Assalam o Alaikum! Welcome to Gilgit Adventure Treks. How can I help you plan your Northern Pakistan adventure?',
  salam: 'Wa Alaikum Assalam! Welcome to Gilgit Adventure Treks. How can I help you today?',
  tour: 'We offer 11 tour packages: 5 signature tours ($600-$2,350) and 6 jeep safari plans ($420-$700). Our most popular are the Blossom Jeep Safari ($600, 10 days) and the Fairy Meadows Safari ($420, 6 days). Which interests you?',
  package: 'We have 11 packages ranging from $420 to $2,350. Jeep safaris start at $420 (Fairy Meadows, 6 days). Our signature tours include the Blossom Safari ($600), Autumn Colors ($680), and K2 Base Camp ($2,350). Want details on any?',
  price: 'Our packages range from $420 (Fairy Meadows Jeep Safari, 6 days) to $2,350 (K2 Base Camp, 18-21 days). Most jeep safaris are $420-$700 for 6-9 days. All include transport, meals, and accommodation!',
  cost: 'Jeep safaris: $420-$700/person (6-9 days). Signature tours: $600-$800/person (10-12 days). K2 Base Camp expedition: $2,350/person (18-21 days). All prices include transport, meals, guide, and accommodation.',
  cheap: 'Our most affordable tour is the Fairy Meadows Jeep Safari at $420-480/person for 6 days. It includes Nanga Parbat views, camping under stars, and the famous most dangerous road jeep ride!',
  budget: 'Budget-friendly options: Fairy Meadows Safari ($420, 6d), Deosai Plains Safari ($500, 7d), Khunjerab Pass Safari ($520, 7d). All include transport, meals, guide, and accommodation.',
  safari: 'We have 6 jeep safari plans: Fairy Meadows ($420, 6d), Deosai Plains ($500, 7d), Khunjerab Pass ($520, 7d), Shandur Pass ($550, 8d), Shimshal Valley ($600, 9d), and Hushe Valley ($620, 9d).',
  jeep: 'Our jeep safari plans: Fairy Meadows ($420, 6d), Deosai Plains ($500, 7d), Khunjerab Pass ($520, 7d), Shandur Pass ($550, 8d), Shimshal Valley ($600, 9d), Hushe Valley ($620, 9d). All include 4x4 jeep transport!',
  blossom: 'The Blossom Jeep Safari is 10 days in spring at $600-650/person. Cherry blossoms, Fairy Meadows, Hunza Valley, Khunjerab Pass, and Phandar Lake. All meals and transport included!',
  k2: 'The K2 Base Camp & Gondogoro La Trek is our ultimate expedition — 18-21 days at $2,350/person. Trek to K2 Base Camp (5,150m), cross Gondogoro La pass (5,585m), with flights, porters, and all equipment included.',
  autumn: 'The Autumn Colors Tour is 11 days at $680-750/person (Oct-Nov). Fly into Skardu, drive through golden Hunza, visit Khunjerab Pass, camp at Fairy Meadows, and return via Naran-Kaghan.',
  october: 'The October Explorer Tour is 11 days at $650-780/person. Visit Khaplu Palace, Shigar Fort, Fairy Meadows, Naltar Lakes, and Hunza Valley in peak autumn colors. Skardu flight included!',
  summer: 'Summer options: Summer Trekking & Tour ($700-800, 12d, Challenging) or our jeep safaris — Deosai Plains ($500, 7d), Fairy Meadows ($420, 6d), Shandur Pass ($550, 8d), Shimshal Valley ($600, 9d), Hushe Valley ($620, 9d).',
  winter: 'Winter is off-season for most tours as passes close due to snow. The best time to visit is spring (Mar-Apr) for blossoms, summer (Jun-Sep) for trekking and safaris, or autumn (Oct-Nov) for golden colors.',
  spring: 'Spring is perfect for the Blossom Jeep Safari ($600-650, 10 days) — cherry and apricot blossoms across Fairy Meadows, Hunza Valley, and Khunjerab Pass. Book early for March-April!',
  hunza: 'Hunza Valley features in many of our tours! The Blossom Safari ($600), Autumn Colors ($680), Khunjerab Pass Safari ($520), and Shimshal Valley Safari ($600) all include Hunza exploration.',
  fairy: 'The Fairy Meadows Jeep Safari is 6 days at $420-480/person. Thrilling jeep ride on the world\'s most dangerous road, camping at 3,300m under Nanga Parbat, and a hike to Beyal Camp.',
  deosai: 'The Deosai Plains Jeep Safari is 7 days at $500-550/person. Drive across the second-highest plateau in the world (4,114m), spot Himalayan brown bears, and camp beside Sheosar Lake.',
  shandur: 'The Shandur Pass Jeep Safari is 8 days at $550-620/person. Visit the famous polo ground at 3,700m, explore Phandar Lake, Gupis Valley, and drive through to Chitral.',
  khunjerab: 'The Khunjerab Pass Jeep Safari is 7 days at $520-580/person. Drive the Karakoram Highway to the highest paved border crossing (4,693m), plus Hunza Valley, Attabad Lake, and Passu Cones.',
  shimshal: 'The Shimshal Valley Jeep Safari is 9 days at $600-680/person. Drive Pakistan\'s most dangerous road to the highest settlement (3,100m), meet legendary mountaineers, and visit yak pastures.',
  hushe: 'The Hushe Valley Jeep Safari is 9 days at $620-700/person. Gateway to Masherbrum (7,821m) and Laila Peak, with Skardu, Khaplu Palace, and remote Karakoram villages.',
  easy: 'Easy-rated tours: Blossom Jeep Safari ($600, 10d), Autumn Colors ($680, 11d), October Explorer ($650, 11d), Deosai Plains Safari ($500, 7d), and Khunjerab Pass Safari ($520, 7d). No trekking experience needed!',
  difficult: 'For a challenge: Summer Trekking & Tour ($700-800, 12d, Challenging — Nanga Parbat Rupal Face) or K2 Base Camp & Gondogoro La ($2,350, 18-21d, Extreme). Both require good fitness.',
  challenging: 'Our challenging options: Summer Trekking & Tour ($700-800, 12d) takes you to Nanga Parbat\'s Rupal Face. For extreme, the K2 Base Camp trek ($2,350, 18-21d) crosses the 5,585m Gondogoro La pass.',
  contact: 'You can reach us at gilgitadventuretreks@gmail.com or through the Contact page on our website. We typically respond within 24 hours!',
  book: 'To book a tour, visit our Destinations page, select a package, and fill in the booking form. Or contact us directly at gilgitadventuretreks@gmail.com and we\'ll help you plan everything!',
  weather: 'Best times: Spring (Mar-Apr) for blossoms 🌸, Summer (Jun-Sep) for trekking and safaris ☀️, Autumn (Oct-Nov) for golden colors 🍂. Winter passes are closed. Temperatures range from -10°C to 25°C depending on altitude.',
  safe: 'Northern Pakistan is very safe for tourists! Gilgit-Baltistan is one of the most peaceful regions. Our experienced guides know every route, and we handle all permits and logistics for a worry-free trip.',
  default: 'We offer 11 tour packages from $420 to $2,350 covering jeep safaris, spring blossoms, autumn colors, summer treks, and the legendary K2 Base Camp. Ask about any specific tour, destination, or budget!'
};

function getFallbackResponse(message) {
  const lower = message.toLowerCase();
  for (const key of Object.keys(fallbackResponses)) {
    if (key === 'default') continue;
    if (lower.includes(key)) return fallbackResponses[key];
  }
  return fallbackResponses.default;
}

const chatHistory = new Map();

function getChatId(req) {
  return req.ip || 'default';
}

// Test endpoint
router.get('/test', async (req, res) => {
  if (!genAI) return res.json({ status: 'FAIL', reason: 'GEMINI_API_KEY not set' });
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent('say hi in one sentence');
    const response = await result.response;
    res.json({ status: 'OK', reply: response.text() });
  } catch (err) {
    res.json({ status: 'FAIL', reason: err.message });
  }
});

router.post('/', async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Try AI first, fall back to keyword responses
  if (genAI) {
    try {
      const chatId = getChatId(req);
      if (!chatHistory.has(chatId)) {
        chatHistory.set(chatId, []);
      }
      const history = chatHistory.get(chatId);

      history.push({ role: 'user', parts: [{ text: message.trim() }] });

      // Keep only last 10 exchanges to save tokens
      if (history.length > 20) {
        history.splice(0, history.length - 20);
      }

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash',
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
      });
      const chat = model.startChat({ history: history.slice(0, -1) });
      const result = await chat.sendMessage(message.trim());
      const response = await result.response;
      const aiText = response.text();

      if (aiText) {
        history.push({ role: 'model', parts: [{ text: aiText }] });
        return res.json({ reply: aiText });
      }
    } catch (err) {
      console.error('Chat AI error:', err.message);
      // Fall through to keyword fallback
    }
  }

  // Fallback: keyword-based responses
  const reply = getFallbackResponse(message);
  res.json({ reply });
});

// Clean up old chat histories every 30 minutes
setInterval(() => {
  chatHistory.clear();
}, 30 * 60 * 1000);

module.exports = router;
