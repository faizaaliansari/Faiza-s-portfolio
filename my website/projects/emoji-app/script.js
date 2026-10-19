/* ==========================================
   EMOJI APP LOGIC
   ========================================== */

// 1. Emoji Database (with categories & keywords for search)
const emojiData = [
  // Smileys & Emotion
  { emoji: "😀", name: "Grinning Face", category: "smileys", keywords: "happy smile" },
  { emoji: "😃", name: "Grinning Face Big Eyes", category: "smileys", keywords: "happy joy" },
  { emoji: "😄", name: "Grinning Squinting", category: "smileys", keywords: "happy laugh" },
  { emoji: "😁", name: "Beaming Face", category: "smileys", keywords: "grin happy" },
  { emoji: "😆", name: "Laughing", category: "smileys", keywords: "lol haha" },
  { emoji: "😅", name: "Sweat Smile", category: "smileys", keywords: "relief sweat" },
  { emoji: "🤣", name: "Rolling on Floor", category: "smileys", keywords: "lol rofl" },
  { emoji: "😂", name: "Face with Tears", category: "smileys", keywords: "lol cry" },
  { emoji: "🙂", name: "Slightly Smiling", category: "smileys", keywords: "smile" },
  { emoji: "😊", name: "Smiling Eyes", category: "smileys", keywords: "happy blush" },
  { emoji: "😇", name: "Smiling Halo", category: "smileys", keywords: "angel" },
  { emoji: "🥰", name: "Smiling Hearts", category: "smileys", keywords: "love" },
  { emoji: "😍", name: "Heart Eyes", category: "smileys", keywords: "love crush" },
  { emoji: "🤩", name: "Star Struck", category: "smileys", keywords: "wow amazing" },
  { emoji: "😘", name: "Kissing Heart", category: "smileys", keywords: "kiss love" },
  { emoji: "😜", name: "Winking Tongue", category: "smileys", keywords: "silly joke" },
  { emoji: "🤪", name: "Zany Face", category: "smileys", keywords: "crazy goofy" },
  { emoji: "🤔", name: "Thinking", category: "smileys", keywords: "hmm think" },
  { emoji: "🤫", name: "Shushing", category: "smileys", keywords: "quiet secret" },
  { emoji: "😎", name: "Cool Sunglasses", category: "smileys", keywords: "cool swag" },
  { emoji: "😭", name: "Loudly Crying", category: "smileys", keywords: "sad cry" },
  { emoji: "😡", name: "Pouting Angry", category: "smileys", keywords: "mad angry" },
  { emoji: "🥺", name: "Pleading Eyes", category: "smileys", keywords: "sad please" },
  { emoji: "😴", name: "Sleeping", category: "smileys", keywords: "sleep tired" },

  // Animals & Nature
  { emoji: "🐶", name: "Dog Face", category: "animals", keywords: "dog puppy" },
  { emoji: "🐱", name: "Cat Face", category: "animals", keywords: "cat kitten" },
  { emoji: "🐭", name: "Mouse Face", category: "animals", keywords: "mouse rat" },
  { emoji: "🐹", name: "Hamster", category: "animals", keywords: "hamster pet" },
  { emoji: "🐰", name: "Rabbit Face", category: "animals", keywords: "bunny rabbit" },
  { emoji: "🦊", name: "Fox", category: "animals", keywords: "fox" },
  { emoji: "🐻", name: "Bear", category: "animals", keywords: "bear" },
  { emoji: "🐼", name: "Panda", category: "animals", keywords: "panda" },
  { emoji: "🦁", name: "Lion", category: "animals", keywords: "lion king" },
  { emoji: "🐮", name: "Cow", category: "animals", keywords: "cow" },
  { emoji: "🐷", name: "Pig", category: "animals", keywords: "pig" },
  { emoji: "🐸", name: "Frog", category: "animals", keywords: "frog" },
  { emoji: "🐵", name: "Monkey", category: "animals", keywords: "monkey" },
  { emoji: "🦋", name: "Butterfly", category: "animals", keywords: "butterfly" },
  { emoji: "🐢", name: "Turtle", category: "animals", keywords: "turtle" },
  { emoji: "🐬", name: "Dolphin", category: "animals", keywords: "dolphin" },

  // Food & Drink
  { emoji: "🍎", name: "Apple", category: "food", keywords: "apple fruit" },
  { emoji: "🍌", name: "Banana", category: "food", keywords: "banana fruit" },
  { emoji: "🍉", name: "Watermelon", category: "food", keywords: "watermelon fruit" },
  { emoji: "🍓", name: "Strawberry", category: "food", keywords: "strawberry fruit" },
  { emoji: "🍕", name: "Pizza", category: "food", keywords: "pizza food" },
  { emoji: "🍔", name: "Burger", category: "food", keywords: "burger food" },
  { emoji: "🍟", name: "Fries", category: "food", keywords: "fries food" },
  { emoji: "🍦", name: "Ice Cream", category: "food", keywords: "ice cream dessert" },
  { emoji: "🍩", name: "Donut", category: "food", keywords: "donut dessert" },
  { emoji: "☕", name: "Coffee", category: "food", keywords: "coffee drink" },
  { emoji: "🍵", name: "Tea", category: "food", keywords: "tea drink" },
  { emoji: "🍰", name: "Cake", category: "food", keywords: "cake dessert" },
  { emoji: "🍫", name: "Chocolate", category: "food", keywords: "chocolate sweet" },
  { emoji: "🍿", name: "Popcorn", category: "food", keywords: "popcorn snack" },

  // Activities & Sports
  { emoji: "⚽", name: "Soccer Ball", category: "activities", keywords: "soccer football" },
  { emoji: "🏀", name: "Basketball", category: "activities", keywords: "basketball" },
  { emoji: "🎮", name: "Game Controller", category: "activities", keywords: "gaming play" },
  { emoji: "🎨", name: "Art Palette", category: "activities", keywords: "art paint" },
  { emoji: "🎸", name: "Guitar", category: "activities", keywords: "guitar music" },
  { emoji: "🎬", name: "Movie Camera", category: "activities", keywords: "movie film" },
  { emoji: "📚", name: "Books", category: "activities", keywords: "books study" },
  { emoji: "✈️", name: "Airplane", category: "activities", keywords: "travel plane" },
  { emoji: "🏆", name: "Trophy", category: "activities", keywords: "win trophy" },

  // Objects
  { emoji: "💻", name: "Laptop", category: "objects", keywords: "laptop computer" },
  { emoji: "📱", name: "Mobile Phone", category: "objects", keywords: "phone mobile" },
  { emoji: "⌚", name: "Watch", category: "objects", keywords: "watch time" },
  { emoji: "💡", name: "Light Bulb", category: "objects", keywords: "idea light" },
  { emoji: "🎁", name: "Gift", category: "objects", keywords: "gift present" },
  { emoji: "🔑", name: "Key", category: "objects", keywords: "key lock" },
  { emoji: "💰", name: "Money Bag", category: "objects", keywords: "money rich" },
  { emoji: "📷", name: "Camera", category: "objects", keywords: "camera photo" },
  { emoji: "🎧", name: "Headphones", category: "objects", keywords: "headphones music" },
  { emoji: "🚗", name: "Car", category: "objects", keywords: "car vehicle" },
  { emoji: "🚀", name: "Rocket", category: "objects", keywords: "rocket space" },
  { emoji: "❤️", name: "Red Heart", category: "objects", keywords: "love heart" },
  { emoji: "✨", name: "Sparkles", category: "objects", keywords: "star magic" },
  { emoji: "🔥", name: "Fire", category: "objects", keywords: "fire hot" }
];

let currentCategory = 'all';
let searchQuery = '';

const grid = document.getElementById('emojiGrid');
const noResults = document.getElementById('noResults');

/* ==========================================
   RENDER EMOJIS
   ========================================== */
function renderEmojis() {
  grid.innerHTML = '';

  let filtered = emojiData.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.keywords.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';

  filtered.forEach(item => {
    const div = document.createElement('div');
    div.className = 'emoji-item';
    div.textContent = item.emoji;
    div.title = item.name; // Tooltip on hover
    div.onclick = () => copyEmoji(item.emoji);
    grid.appendChild(div);
  });
}

/* ==========================================
   COPY TO CLIPBOARD
   ========================================== */
function copyEmoji(emoji) {
  navigator.clipboard.writeText(emoji).then(() => {
    showToast(emoji);
  }).catch(err => {
    // Fallback if clipboard API fails
    const textArea = document.createElement("textarea");
    textArea.value = emoji;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showToast(emoji);
  });
}

/* ==========================================
   FILTERS & SEARCH
   ========================================== */
function filterCategory(cat, btnElement) {
  currentCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  renderEmojis();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value;
  renderEmojis();
});

/* ==========================================
   TOAST NOTIFICATION
   ========================================== */
let toastTimeout;
function showToast(emoji) {
  const toast = document.getElementById('toast');
  document.getElementById('toastEmoji').textContent = emoji;
  
  toast.classList.add('show');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

/* ==========================================
   INITIALIZE
   ========================================== */
renderEmojis();