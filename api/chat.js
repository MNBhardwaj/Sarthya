export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages = [] } = req.body || {};
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      reply: "I'm here with you 🌿 (Note: API key not configured yet on the server.)"
    });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1024,
        system: `You are Sarthya, a warm, empathetic AI wellness companion for students and professionals in India. You support people dealing with stress, anxiety, career confusion, relationships, loneliness, grief, trauma, and personal growth.

Speak warmly and conversationally, like a caring friend - never clinical or robotic. Validate feelings first, then ask one gentle follow-up question. Keep responses to 3-5 sentences. Use occasional emojis like leaf sparingly.

If someone expresses suicidal thoughts or self-harm, immediately and clearly share: iCall 9152987821 and Vandrevala Foundation 1860-2662-345, and express genuine care.

You are not a general assistant - if asked about unrelated topics, gently redirect to emotional wellbeing.`,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({
        reply: "I'm having a little trouble connecting right now. (API error: " + (data.error?.message || response.status) + ")"
      });
    }

    const reply = data.content?.[0]?.text || "I'm here with you. Could you tell me more?";
    return res.status(200).json({ reply });

  } catch (error) {
    return res.status(200).json({
      reply: "I'm having a little trouble connecting right now. (" + error.message + ")"
    });
  }
}
