const crisisWords = [
  "suicide",
  "kill myself",
  "end my life",
  "hurt myself",
  "self harm",
  "die",
  "want to die",
];

const topics = [
  {
    name: "exam",
    words: ["exam", "study", "marks", "neet", "jee", "student", "fail", "syllabus"],
    replies: [
      "Exam pressure can make everything feel urgent. Let’s make it smaller: what is the one topic or task creating the most pressure right now?",
      "You don’t need to finish everything in one breath. Tell me what feels heavier right now — fear of failure, lack of preparation, or pressure from people?",
      "Studying becomes harder when your mind is scared. Let’s first calm the mind, then plan the next small step. What exam are you preparing for?",
    ],
  },
  {
    name: "career",
    words: ["career", "job", "future", "business", "startup", "resign", "salary"],
    replies: [
      "Career confusion usually means you care deeply about your future. Let’s not solve your whole life today. Are you confused about choosing, changing, or starting something?",
      "It sounds like your mind is carrying a lot of future pressure. What feels most scary — failure, money, comparison, or making the wrong choice?",
      "Let’s bring some clarity. What are the two options you are currently stuck between?",
    ],
  },
  {
    name: "relationship",
    words: ["relationship", "love", "breakup", "ex", "girlfriend", "boyfriend", "wife", "husband"],
    replies: [
      "Relationships can affect our peace very deeply. Your feelings are valid. Do you want to talk about what happened or what you’re finding hardest to accept?",
      "That sounds emotionally heavy. Is the pain more about missing the person, feeling misunderstood, or feeling rejected?",
      "Love and attachment can make the mind very restless. Tell me what happened recently that hurt you the most.",
    ],
  },
  {
    name: "stress",
    words: ["stress", "pressure", "overwhelmed", "tired", "burnout", "exhausted"],
    replies: [
      "That sounds really overwhelming. Let’s slow it down together. Is this stress coming more from work, studies, people, money, or your own expectations?",
      "You’ve probably been holding too much for too long. What is the biggest thing weighing on you today?",
      "When everything feels heavy, we don’t need a perfect solution immediately. We need one small next step. What feels most urgent right now?",
    ],
  },
  {
    name: "anxiety",
    words: ["anxiety", "panic", "fear", "scared", "worried", "overthinking"],
    replies: [
      "Anxiety can make even small things feel dangerous. You’re not weak for feeling this. What thought keeps repeating in your mind?",
      "Let’s slow the loop. Take one breath and tell me — is this fear about something happening now, or something that might happen later?",
      "Overthinking often tries to protect us, but it can exhaust us. What is the main question your mind keeps asking again and again?",
    ],
  },
  {
    name: "loneliness",
    words: ["lonely", "alone", "no one", "ignored", "empty"],
    replies: [
      "I’m sorry you’re feeling alone. Loneliness can hurt even when people are around. When do you feel it the most — at night, during work, or when you see others?",
      "That empty feeling can be very painful. I’m here with you. Did something happen today that made you feel unseen?",
      "Feeling alone doesn’t mean you are unworthy of connection. Tell me — do you miss a person, a phase of life, or the feeling of being understood?",
    ],
  },
  {
    name: "confidence",
    words: ["confidence", "insecure", "not good enough", "ugly", "failure", "worthless"],
    replies: [
      "Low confidence can make you doubt even your real strengths. Where do you feel ‘not enough’ the most — looks, studies, work, communication, or relationships?",
      "I hear that self-doubt. But one difficult phase is not your full identity. What made you feel this way recently?",
      "Confidence is rebuilt through small proof, not pressure. What is one small thing you handled well recently, even if it was tiny?",
    ],
  },
  {
    name: "family",
    words: ["family", "parents", "mother", "father", "home", "marriage"],
    replies: [
      "Family pressure can feel painful because we want love and freedom at the same time. Is the pressure about career, money, marriage, expectations, or control?",
      "That sounds emotionally complicated. With family, even small conflicts can feel heavy. What do you wish they understood about you?",
      "You can love your family and still feel hurt by them. What happened recently?",
    ],
  },
  {
    name: "work",
    words: ["work", "office", "manager", "boss", "colleague", "company"],
    replies: [
      "Work pressure can slowly become emotional exhaustion. Is the weight coming from workload, your manager, office politics, lack of growth, or fear of instability?",
      "That sounds draining. What part of work is affecting your peace the most right now?",
      "Sometimes professional stress becomes personal pain. What are you carrying after office hours that you can’t switch off from?",
    ],
  },
  {
    name: "sleep",
    words: ["sleep", "insomnia", "can't sleep", "night", "awake"],
    replies: [
      "Sleep becomes difficult when the mind feels unfinished. What usually keeps you awake — overthinking, phone use, fear, or body restlessness?",
      "Your body may be tired but your mind may still be alert. What thought becomes loudest at night?",
      "Tonight, don’t fight your thoughts. Try writing the top three worries on paper. What is the main worry disturbing your sleep?",
    ],
  },
];

const followUps = [
  "I’m listening. Tell me a little more.",
  "That makes sense. What part of this hurts the most?",
  "You don’t have to explain it perfectly. Start wherever it feels easiest.",
  "That sounds important. What happened just before you started feeling this way?",
  "Let’s take it slowly. What do you need most right now — clarity, comfort, courage, or a plan?",
];

function includesAny(text, words) {
  return words.some((word) => text.includes(word));
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectTopics(text) {
  return topics.filter((topic) => includesAny(text, topic.words));
}

function buildReply(text, previousMessages) {
  if (includesAny(text, crisisWords)) {
    return "I’m really sorry you’re feeling this much pain. Please don’t stay alone with this right now. If you feel you might hurt yourself or you’re in immediate danger, call local emergency services or reach out to someone near you immediately. In India, you can contact iCall at 9152987821. You deserve immediate human support.";
  }

  if (!text || text.length < 3) {
    return "I’m here with you 🌿 You can start with just one word — stressed, sad, confused, angry, lonely, or tired.";
  }

  const matched = detectTopics(text);

  if (matched.length >= 2) {
    const first = matched[0];
    const second = matched[1];

    return (
      pick(first.replies) +
      " I’m also sensing there may be another layer around " +
      second.name +
      ". Let’s handle this gently — which part feels heavier right now?"
    );
  }

  if (matched.length === 1) {
    return pick(matched[0].replies);
  }

  if (previousMessages.length > 4) {
    return (
      pick(followUps) +
      " From what you’ve shared, it sounds like this has been sitting with you for a while. What would feel like relief today — talking, planning, or just being understood?"
    );
  }

  return pick(followUps);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages = [] } = req.body || {};
  const lastMessage = messages[messages.length - 1]?.content || "";
  const text = lastMessage.toLowerCase();

  const reply = buildReply(text, messages);

  return res.status(200).json({ reply });
}
