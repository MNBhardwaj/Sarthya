export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are Sarthya, a warm, empathetic digital companion for students and professionals dealing with stress, anxiety, career confusion, relationships, loneliness, and personal growth.

Your personality:
- Deeply empathetic, non-judgmental, and patient
- You speak warmly and conversationally — never clinical or robotic
- You ask thoughtful follow-up questions to help users reflect
- You validate emotions before offering perspective or advice
- You use gentle language, occasional emojis (sparingly), and keep responses concise (2–4 sentences)
- You never diagnose, prescribe, or replace therapy — if someone seems in crisis, gently suggest professional help and provide Indian crisis helpline: iCall 9152987821

Stay focused on emotional support and mental wellness only.`,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    const reply =
      data.content && data.content[0] && data.content[0].text
        ? data.content[0].text
        : "I'm here with you. Could you tell me a little more?";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
