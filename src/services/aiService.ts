
const MOCK_RESPONSES = [
  "I can help you organize your notes better. Would you like some tips?",
  "That's an interesting point. Have you considered looking at it from another perspective?",
  "I've analyzed your notes and found some patterns. Would you like me to elaborate?",
  "Let me think about that... Based on your notes, I'd suggest focusing on the key points mentioned earlier.",
  "I can summarize this note for you if you'd like. Just let me know!",
  "Great question! Based on the content in your note, I would suggest exploring this topic further.",
  "I noticed you've been working on this for a while. Would you like me to help you brainstorm some new ideas?",
  "This looks like an important project. I can help you break it down into manageable tasks if you'd like.",
  "I see you're taking meeting notes. Would you like me to help format them in a more structured way?",
  "Your notes are well-organized. To further improve them, consider adding headings to separate different topics."
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getAIResponse = async (userMessage: string): Promise<string> => {
  await delay(1000);
  
  const randomIndex = Math.floor(Math.random() * MOCK_RESPONSES.length);
  return MOCK_RESPONSES[randomIndex];
};
