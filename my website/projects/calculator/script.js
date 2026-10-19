/* ==========================================
   CALCULATOR LOGIC
   ========================================== */

let currentInput = "";
let currentExpression = "";
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];

const resultEl = document.getElementById('result');
const expressionEl = document.getElementById('expression');
const historyList = document.getElementById('historyList');

// 1. Update Display Function
function updateDisplay() {
  // Replace * and / with nicer symbols for display
  let displayExp = currentExpression.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ');
  expressionEl.textContent = displayExp;
  
  // Result show karega ya current number
  resultEl.textContent = currentInput === "" ? "0" : currentInput;
}

// 2. Number Input
function appendNumber(num) {
  // Prevent multiple decimal points in one number
  if (num === '.' && currentInput.includes('.')) return;
  
  currentInput += num;
  currentExpression += num;
  updateDisplay();
}

// 3. Operator Input
function appendOperator(op) {
  if (currentInput === "" && currentExpression === "") return; // Don't start with operator
  
  // Replace last operator if user clicks another operator
  const lastChar = currentExpression.slice(-1);
  if (['+', '-', '*', '/', '%'].includes(lastChar)) {
    currentExpression = currentExpression.slice(0, -1) + op;
  } else {
    currentExpression += op;
  }
  
  currentInput = ""; // Reset current input to enter new number
  updateDisplay();
}

// 4. Clear All (AC)
function clearAll() {
  currentInput = "";
  currentExpression = "";
  resultEl.textContent = "0";
  expressionEl.textContent = "";
}

// 5. Backspace
function backspace() {
  if (currentInput !== "") {
    currentInput = currentInput.slice(0, -1);
    currentExpression = currentExpression.slice(0, -1);
  } else if (currentExpression !== "") {
    currentExpression = currentExpression.slice(0, -1);
  }
  updateDisplay();
}

// 6. Calculate Result
function calculate() {
  if (currentExpression === "") return;
  
  try {
    // Evaluate the expression (using Function instead of eval for minor security)
    // Replace % with /100 for percentage calculation
    let evalExpression = currentExpression.replace(/%/g, '/100');
    
    // Check if expression ends with an operator (prevent syntax error)
    if (['+', '-', '*', '/'].includes(evalExpression.slice(-1))) {
      evalExpression = evalExpression.slice(0, -1);
    }

    let result = new Function("return " + evalExpression)();
    
    // Fix floating point issues (e.g., 0.1 + 0.2 = 0.30000000000000004)
    result = Math.round(result * 100000000) / 100000000;

    if (!isFinite(result)) throw new Error("Cannot divide by zero");

    // Save to History
    saveToHistory(currentExpression, result);

    // Update Display
    expressionEl.textContent = currentExpression + " =";
    resultEl.textContent = result;
    
    // Set for next calculation
    currentInput = result.toString();
    currentExpression = result.toString();

  } catch (error) {
    resultEl.textContent = "Error";
    currentInput = "";
    currentExpression = "";
    setTimeout(() => { resultEl.textContent = "0"; }, 1500);
  }
}

/* ==========================================
   HISTORY FEATURE
   ========================================== */

function saveToHistory(exp, res) {
  let displayExp = exp.replace(/\*/g, ' × ').replace(/\//g, ' ÷ ');
  history.unshift({ exp: displayExp, res: res });
  if (history.length > 10) history.pop(); // Keep only last 10
  
  localStorage.setItem('calcHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = '<li class="empty-history">No calculations yet.</li>';
    return;
  }
  historyList.innerHTML = history.map(item => `
    <li>
      <span>${item.exp}</span>
      ${item.res}
    </li>
  `).join('');
}

function clearHistory() {
  history = [];
  localStorage.removeItem('calcHistory');
  renderHistory();
}

function toggleHistory() {
  document.getElementById('historyPanel').classList.toggle('show');
}

/* ==========================================
   KEYBOARD SUPPORT
   ========================================== */
document.addEventListener('keydown', (e) => {
  const key = e.key;
  
  if (/[0-9]/.test(key)) appendNumber(key);
  else if (key === '.') appendNumber('.');
  else if (['+', '-', '*', '/'].includes(key)) appendOperator(key);
  else if (key === '%') appendOperator('%');
  else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    calculate();
  }
  else if (key === 'Backspace') backspace();
  else if (key === 'Escape') clearAll();
});

/* ==========================================
   INITIALIZE
   ========================================== */
updateDisplay();
renderHistory();