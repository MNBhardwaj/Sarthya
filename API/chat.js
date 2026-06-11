// ─────────────────────────────────────────────────────────────────
// Sarthya — /api/chat.js
// Primary: Anthropic Claude API (warm, empathetic AI responses)
// Fallback: Rule-based system (if API key missing or API down)
// ─────────────────────────────────────────────────────────────────

// ── FALLBACK: rule-based engine (kept as safety net) ─────────────
const crisisWords = [
  "suicide", "kill myself", "end my life", "hurt myself",
  "self harm", "want to die", "khatam", "marna chahta", "marna chahti"
];

const topics = [
  { name: "exam", words: ["exam", "study", "marks", "neet", "jee", "student", "fail", "syllabus"], replies: ["Exam pressure can make everything feel urgent. What is the one subject or topic creating the most stress right now?", "You don't need to solve everything today. Tell me — is the fear more about the exam itself, or the expectations of people around you?"] },
  { name: "career", words: ["career", "job", "future", "business", "startup", "resign", "salary"], replies: ["Career confusion usually means you care deeply about your future. Are you stuck between choices, thinking of a change, or unsure where to start?", "What feels scariest right now — failure, money, comparison, or making the wrong choice?"] },
  { name: "relationship", words: ["relationship", "love", "breakup", "ex", "girlfriend", "boyfriend", "wife", "husband", "partner"], replies: ["Relationships can affect our peace very deeply. Your feelings are valid. Do you want to talk about what happened, or what you're finding hardest to accept?", "Is the pain more about missing the person, feeling misunderstood, or feeling rejected?"] },
  { name: "stress", words: ["stress", "pressure", "overwhelmed", "tired", "burnout", "exhausted"], replies: ["That sounds really heavy. Is this stress coming more from work, studies, people, money, or your own expectations?", "You've probably been holding too much for too long. What is the biggest thing weighing on you today?"] },
  { name: "anxiety", words: ["anxiety", "panic", "fear", "scared", "worried", "overthinking"], replies: ["Anxiety can make even small things feel dangerous. You're not weak for feeling this. What thought keeps repeating in your mind?", "Is this fear about something happening now, or something that might happen later?"] },
  { name: "loneliness", words: ["lonely", "alone", "no one", "ignored", "empty", "isolated"], replies: ["I'm here with you. Loneliness can hurt even when people are around. When do you feel it most — at night, during the day, or when you see others?", "That empty feeling is real and painful. Did something happen today that made you feel unseen?"] },
  { name: "grief", words: ["lost", "died", "death", "grief", "miss", "gone", "passed away", "bereaved"], replies: ["Losing someone is one of the hardest things a person can go through. There is no right way to grieve. What do you miss most about them?", "Grief doesn't follow a timeline. I'm here with you in this. Would you like to talk about them, or about how you've been coping?"] },
  { name: "trauma", words: ["trauma", "ptsd", "flashback", "nightmare", "abuse", "assault", "past", "haunt"], replies: ["What you went through matters, and so does how it still affects you. You don't have to share everything at once — just what feels okay to share.", "Healing from painful past experiences takes real courage. Are you looking to understand what you're feeling, or are you looking for ways to cope?"] },
];

const followUps = [
  "I'm listening. Tell me a little more.",
  "That makes sense. What part of this hurts the most right now?",
  "You don't have to explain it perfectly. Start wherever feels easiest.",
  "Let's take it slowly. What do you need most right now — clarity, comfort, or just to be heard?",
  "I'm here with you. What would feel like even a small relief today?",
];

function includesAny(text, words) { return words.some(w => text.includes(w)); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function fallbackReply(text, previousMessages) {
  if (includesAny(text, crisisWords)) {
    return "I'm really sorry you're feeling this much pain right now. Please don't stay alone with this. If you feel you might hurt yourself, please contact someone near you or call iCall at 9152987821 (India). You deserve immediate human support — this matters deeply.";
  }
  if (!text || text.length < 3) return "I'm here with you 🌿 You can start with just one word — stressed, sad, confused, tired, or lonely.";
  const matched = topics.filter(t => includesAny(text, t.words));
  if (matched.length >= 2) return pick(matched[0].replies) + " I'm also sensing something around " + matched[1].name + ". Which feels heavier right now?";
  if (matched.length === 1) return pick(matched[0].replies);
  if (previousMessages.length > 4) return pick(followUps) + " From what you've shared, this seems like it's been with you a while. I'm not going anywhere.";
  return pick(followUps);
}

// ── SYSTEM PROMPT for Claude ──────────────────────────────────────
const SYSTEM_PROMPT = `You are Sarthya, a warm and deeply empathetic AI mental wellness companion built for students and professionals in India. You were created to be a safe, non-judgemental first space for people dealing with stress, anxiety, loneliness, career confusion, relationships, grief, trauma, and personal growth.

Your personality and communication style:
- Warm, gentle, and deeply human — never clinical, robotic, or formal
- You speak like a wise, caring friend who truly listens — not like a therapist reading from a manual
- Use simple, clear language. Many users may be more comfortable with casual English or Hinglish — match their tone naturally
- Keep responses to 3–5 sentences unless the person has shared something complex that genuinely needs more
- Always validate feelings FIRST before offering any reflection or gentle question
- Ask ONE thoughtful follow-up question at the end of your response to deepen the conversation
- Never give medical diagnoses, prescribe treatments, or make clinical assessments
- Never be dismissive, toxic-positive, or offer hollow reassurance like "everything will be fine"
- Use occasional gentle emojis (🌿 🌱 💙) — sparingly and naturally, never excessively

Crisis protocol (CRITICAL):
- If the user expresses suicidal ideation, self-harm, or immediate danger — immediately and clearly provide: iCall: 9152987821 and Vandrevala Foundation: 1860-2662-345. Do not continue the normal conversation flow. Express genuine care and urge them to call.

Topics you support deeply:
- Stress and anxiety (academic, professional, financial)
- Career confusion, burnout, workplace stress
- Relationships, breakups, loneliness
- Grief and personal loss
- Trauma and PTSD (always with extra gentleness — encourage professional support)
- Personal growth, confidence, habits
- Student life — exams, comparison, pressure, identity
- Family pressure, marriage expectations, societal comparisons

Cultural context:
- You understand the Indian context — pressure of competitive exams like JEE/NEET, family expectations around marriage and career, societal comparison culture, and the stigma around mental health. You gently acknowledge these realities.
- You never shame anyone for their background, choices, or feelings.

You are NOT a general assistant. If asked about coding, news, recipes, or anything unrelated to emotional wellbeing — kindly and warmly redirect: "I'm here mainly for your emotional wellbeing 🌿 For that I'd love to keep listening. Is there something on your heart today?"`;

// ── MAIN HANDLER ─────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages = [] } = req.body || {};

  // Quick crisis check before API call
  const lastMsg = (messages[messages.length - 1]?.content || "").toLowerCase();
  if (crisisWords.some(w => lastMsg.includes(w))) {
    return res.status(200).json({
      reply: "I'm really sorry you're feeling this much pain right now. Please don't stay alone with this. Reach out to iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345 — trained counselors are there for you right now. You deserve real human support and you matter deeply. 💙"
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  // ── No API key → use fallback ────────────────────────────────
  if (!apiKey) {
    const text = lastMsg;
    const reply = fallbackReply(text, messages);
    return res.status(200).json({ reply });
  }

  // ── Call Anthropic API ───────────────────────────────────────
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Anthropic API error:", err);
      // Graceful fallback if API fails
      return res.status(200).json({ reply: fallbackReply(lastMsg, messages) });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || fallbackReply(lastMsg, messages);

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Chat handler error:", error);
    // Graceful fallback on network error
    return res.status(200).json({ reply: fallbackReply(lastMsg, messages) });
  }
}
