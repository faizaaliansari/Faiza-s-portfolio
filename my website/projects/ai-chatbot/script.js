/* ==========================================
   AI CHATBOT LOGIC
   ========================================== */

const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');
const voiceToggle = document.getElementById('voiceToggle');
const clearChat = document.getElementById('clearChat');

let isVoiceEnabled = false;

/* ==========================================
   1. KNOWLEDGE BASE (Bot ke Jawabaat)
   ========================================== */
const botKnowledge = [
  { keywords: ["hello", "hi", "hey", "salam"], reply: "Hello! I am Faiza's AI assistant. How can I help you today? 😊" },
  { keywords: ["your name", "who are you"], reply: "I am a custom AI chatbot built by Miss Faiza Ali for her web development portfolio. I run purely on JavaScript! 🤖" },
  { keywords: ["faiza", "owner", "creator"], reply: "Miss Faiza Ali is an IT Trainer, Excel Expert, and Web Developer. She built me using HTML, CSS, and JavaScript!" },
  { keywords: ["how are you", "how is it going"], reply: "I'm doing great! Thank you for asking. How are you doing today? 😊" },
  { keywords: ["help", "what can you do"], reply: "I can answer basic questions about Faiza, tell you a joke, give you the current time, or just have a friendly chat!" },
  { keywords: ["time", "clock", "date"], reply: () => `The current time on your device is ${new Date().toLocaleTimeString()}.` },
  { keywords: ["joke", "funny", "laugh"], reply: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄" },
  { keywords: ["weather"], reply: "I am a simple JavaScript bot, I don't have access to live weather APIs right now. But I hope it's sunny where you are! ☀️" },
  { keywords: ["portfolio", "projects", "work"], reply: "Faiza has built 10+ amazing projects including E-commerce stores, Dashboards, Games, and Web Apps. Scroll down her portfolio to see them all! 🚀" },
  { keywords: ["excel", "ms office"], reply: "Faiza is an Excel Expert! She teaches advanced formulas, dashboards, and VBA macros." },
  { keywords: ["bye", "goodbye", "see you"], reply: "Goodbye! Have a wonderful day. Feel free to refresh the page to chat again! 👋" }
];

// Default fallback replies
const fallbackReplies = [
  "That's interesting! Tell me more. 🤔",
  "I'm still learning. Could you ask that in a different way?",
  "I don't have an answer for that yet, but Faiza is constantly upgrading my code! 💻",
  "Hmm, I didn't quite catch that. Try asking about my creator, a joke, or the time!"
];

/* ==========================================
   2. CHAT FUNCTIONS
   ========================================== */

// Add Message to UI
function addMessage(text, sender) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);

  const avatarIcon = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
  
  msgDiv.innerHTML = `
    <div class="message-avatar">${avatarIcon}</div>
    <div class="message-content">${text}</div>
  `;

  chatMessages.appendChild(msgDiv);
  scrollToBottom();

  // Agar bot ka message hai aur voice on hai, toh sunein
  if (sender === 'bot' && isVoiceEnabled) {
    speakText(text);
  }
}

// Auto Scroll to Bottom
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show Typing Indicator
function showTyping() {
  typingIndicator.style.display = 'flex';
  scrollToBottom();
}
function hideTyping() {
  typingIndicator.style.display = 'none';
}

/* ==========================================
   3. AI BRAIN (Reply Generator)
   ========================================== */
function getBotReply(input) {
  const text = input.toLowerCase();

  for (let item of botKnowledge) {
    // Check if any keyword matches the user's input
    if (item.keywords.some(keyword => text.includes(keyword))) {
      // Check if reply is a function (like for time)
      if (typeof item.reply === 'function') {
        return item.reply();
      }
      return item.reply;
    }
  }

  // Fallback random reply
  return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
}

/* ==========================================
   4. SEND MESSAGE FLOW
   ========================================== */
function sendMessage() {
  const text = userInput.value.trim();
  if (text === "") return;

  // 1. User ka message show karein
  addMessage(text, 'user');
  userInput.value = '';

  // 2. Bot ko sochne ka waqt dein (Typing indicator)
  showTyping();

  setTimeout(() => {
    hideTyping();
    // 3. Bot ka reply generate karein
    const reply = getBotReply(text);
    addMessage(reply, 'bot');
  }, 1200); // 1.2 seconds delay for realistic AI feel
}

/* ==========================================
   5. VOICE / TEXT-TO-SPEECH (TTS)
   ========================================== */
function speakText(text) {
  // Remove emojis for cleaner speech
  const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  
  const speech = new SpeechSynthesisUtterance(cleanText);
  speech.lang = 'en-US';
  speech.rate = 1;
  speech.pitch = 1;
  window.speechSynthesis.speak(speech);
}

voiceToggle.addEventListener('click', () => {
  isVoiceEnabled = !isVoiceEnabled;
  voiceToggle.classList.toggle('active', isVoiceEnabled);
  
  if (isVoiceEnabled) {
    voiceToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    speakText("Voice enabled. I am listening.");
  } else {
    voiceToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    window.speechSynthesis.cancel(); // Stop speaking
  }
});

/* ==========================================
   6. EVENT LISTENERS & INITIALIZATION
   ========================================== */

// Send on button click
sendBtn.addEventListener('click', sendMessage);

// Send on Enter key
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Clear Chat
clearChat.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear the conversation?")) {
    chatMessages.innerHTML = '';
    window.speechSynthesis.cancel();
    initChat();
  }
});

// Initial Bot Greeting
function initChat() {
  setTimeout(() => {
    addMessage("Hello! I am Faiza's AI assistant. Ask me a question, ask for a joke, or ask for the time! 😊", 'bot');
  }, 500);
}

// Start the chat when page loads
window.onload = initChat;