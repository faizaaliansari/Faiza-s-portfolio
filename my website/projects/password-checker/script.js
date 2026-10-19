/* ==========================================
   PASSWORD STRENGTH CHECKER LOGIC
   ========================================== */

const passwordInput = document.getElementById('passwordInput');
const toggleVisibility = document.getElementById('toggleVisibility');
const meterBar = document.getElementById('meterBar');
const strengthText = document.getElementById('strengthText');
const crackTimeEl = document.getElementById('crackTime');

// Requirement Elements
const reqLength = document.getElementById('length');
const reqUpper = document.getElementById('uppercase');
const reqLower = document.getElementById('lowercase');
const reqNumber = document.getElementById('number');
const reqSymbol = document.getElementById('symbol');

// Regex Patterns
const patterns = {
  length: /.{8,}/,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  symbol: /[^A-Za-z0-9]/ // Anything that is not a letter or number
};

/* ==========================================
   1. CHECK PASSWORD STRENGTH
   ========================================== */
function checkStrength() {
  const val = passwordInput.value;
  
  let score = 0;
  
  // Check each requirement and update checklist UI
  const checks = {
    length: patterns.length.test(val),
    uppercase: patterns.uppercase.test(val),
    lowercase: patterns.lowercase.test(val),
    number: patterns.number.test(val),
    symbol: patterns.symbol.test(val)
  };

  // Update UI for checklist
  Object.keys(checks).forEach(key => {
    const el = document.getElementById(key);
    if (checks[key]) {
      el.classList.add('valid');
      el.querySelector('i').className = 'fas fa-check-circle';
      score++;
    } else {
      el.classList.remove('valid');
      el.querySelector('i').className = 'far fa-circle';
    }
  });

  // Update Strength Meter & Text based on Score
  updateMeter(score, val);
  
  // Calculate Crack Time
  calculateCrackTime(val);
}

/* ==========================================
   2. UPDATE METER UI
   ========================================== */
function updateMeter(score, val) {
  if (val.length === 0) {
    meterBar.style.width = '0%';
    strengthText.textContent = 'Enter a password';
    strengthText.style.color = '#94a3b8';
    return;
  }

  const levels = [
    { width: '20%', color: '#ef4444', text: 'Very Weak' },   // Score 1
    { width: '40%', color: '#f59e0b', text: 'Weak' },        // Score 2
    { width: '60%', color: '#eab308', text: 'Fair' },        // Score 3
    { width: '80%', color: '#3b82f6', text: 'Strong' },      // Score 4
    { width: '100%', color: '#10b981', text: 'Very Strong' } // Score 5
  ];

  // Handle edge case where password is typed but fails score (e.g., only 1 char)
  let levelIndex = score > 0 ? score - 1 : 0;
  if(score === 0 && val.length > 0) {
      meterBar.style.width = '10%';
      meterBar.style.background = '#ef4444';
      strengthText.textContent = 'Very Weak';
      strengthText.style.color = '#ef4444';
      return;
  }

  const level = levels[levelIndex];
  meterBar.style.width = level.width;
  meterBar.style.background = level.color;
  
  strengthText.textContent = level.text;
  strengthText.style.color = level.color;
}

/* ==========================================
   3. CALCULATE CRACK TIME (Estimate)
   ========================================== */
function calculateCrackTime(password) {
  if (password.length === 0) {
    crackTimeEl.textContent = '—';
    return;
  }

  // Estimate character pool size
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;

  // Formula: Combinations = poolSize ^ length
  const combinations = Math.pow(poolSize, password.length);
  
  // Assume hacker can guess 1 Billion passwords per second (10^9)
  const guessesPerSecond = 1000000000;
  const secondsToCrack = combinations / guessesPerSecond;

  crackTimeEl.textContent = formatTime(secondsToCrack);
}

// Convert seconds into readable format
function formatTime(seconds) {
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;
  
  const years = days / 365;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1000000) return `${Math.round(years / 1000)} Thousand Years`;
  if (years < 1000000000) return `${Math.round(years / 1000000)} Million Years`;
  
  return "Centuries (Uncrackable)";
}

/* ==========================================
   4. SHOW/HIDE PASSWORD
   ========================================== */
toggleVisibility.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
  } else {
    passwordInput.type = 'password';
    toggleVisibility.innerHTML = '<i class="fas fa-eye"></i>';
  }
});

/* ==========================================
   5. GENERATE STRONG PASSWORD
   ========================================== */
function generatePassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  
  const allChars = upper + lower + numbers + symbols;
  const length = 16; // 16 character password
  let password = "";

  // Ensure at least one of each type is included
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password so the required chars aren't always at the start
  password = password.split('').sort(() => 0.5 - Math.random()).join('');

  // Update UI
  passwordInput.value = password;
  passwordInput.type = 'text'; // Show it so user can see
  toggleVisibility.innerHTML = '<i class="fas fa-eye-slash"></i>';
  
  checkStrength();
}

/* ==========================================
   6. COPY TO CLIPBOARD
   ========================================== */
function copyPassword() {
  const val = passwordInput.value;
  if (!val) {
    showToast("Nothing to copy!", true);
    return;
  }

  navigator.clipboard.writeText(val).then(() => {
    showToast("Password copied to clipboard!");
  }).catch(() => {
    showToast("Failed to copy!", true);
  });
}

function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  
  toast.style.background = isError ? '#ef4444' : '#10b981';
  toast.querySelector('i').className = isError ? 'fas fa-exclamation-circle' : 'fas fa-check-circle';
  
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ==========================================
   EVENT LISTENERS
   ========================================== */
passwordInput.addEventListener('input', checkStrength);