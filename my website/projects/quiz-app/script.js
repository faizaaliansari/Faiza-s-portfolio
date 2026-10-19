const questions = [
  { q: "Which Excel function adds all numbers in a range?", options: ["SUM", "ADD", "TOTAL", "PLUS"], correct: 0 },
  { q: "What does VLOOKUP stand for?", options: ["Vertical Lookup", "Value Lookup", "Variable Lookup", "Vector Lookup"], correct: 0 },
  { q: "Which language is used for web page styling?", options: ["HTML", "CSS", "JavaScript", "Python"], correct: 1 },
  { q: "What is the shortcut to save in Excel?", options: ["Ctrl+S", "Ctrl+P", "Ctrl+V", "Ctrl+C"], correct: 0 },
  { q: "Which SQL command retrieves data?", options: ["GET", "SELECT", "FETCH", "PULL"], correct: 1 },
  { q: "What does PHP stand for?", options: ["Personal Home Page", "PHP: Hypertext Preprocessor", "Pre Hypertext Page", "Page Hypertext Protocol"], correct: 1 },
  { q: "Which Excel function finds the average?", options: ["AVG", "MEAN", "AVERAGE", "MID"], correct: 2 },
  { q: "Which is NOT a programming language?", options: ["Python", "JavaScript", "HTML", "Java"], correct: 2 },
  { q: "In Excel, which symbol starts a formula?", options: ["+", "=", "@", "#"], correct: 1 },
  { q: "Which database language is standard?", options: ["SQL", "Python", "Java", "C++"], correct: 0 }
];

let currentQ = 0, score = 0, userAnswers = [], timerInterval, timeLeft = 30;
const totalQ = questions.length;

document.getElementById('totalQ').textContent = totalQ;

document.getElementById('startBtn').addEventListener('click', () => {
  showScreen('quizScreen');
  loadQuestion();
});

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function loadQuestion() {
  const q = questions[currentQ];
  document.getElementById('currentQ').textContent = currentQ + 1;
  document.getElementById('questionText').textContent = q.q;
  document.getElementById('progressFill').style.width = `${((currentQ) / totalQ) * 100}%`;

  const container = document.getElementById('optionsContainer');
  container.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.innerHTML = `<span class="option-letter">${letters[i]}</span> ${opt}`;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    container.appendChild(btn);
  });

  document.getElementById('nextBtn').style.display = 'none';
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 30;
  const timerEl = document.getElementById('timer');
  timerEl.textContent = timeLeft;
  timerEl.parentElement.classList.remove('warning');

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 10) timerEl.parentElement.classList.add('warning');
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoSelect();
    }
  }, 1000);
}

function autoSelect() {
  userAnswers[currentQ] = null;
  showCorrectAnswer(-1);
}

function selectAnswer(index, btn) {
  clearInterval(timerInterval);
  document.querySelectorAll('.option').forEach(o => o.classList.add('disabled'));
  userAnswers[currentQ] = index;
  showCorrectAnswer(index);
}

function showCorrectAnswer(selectedIndex) {
  const correct = questions[currentQ].correct;
  const options = document.querySelectorAll('.option');
  options.forEach((opt, i) => {
    if (i === correct) opt.classList.add('correct');
    else if (i === selectedIndex) opt.classList.add('wrong');
  });

  if (selectedIndex === correct) score++;
  document.getElementById('nextBtn').style.display = 'inline-flex';
}

document.getElementById('nextBtn').addEventListener('click', () => {
  currentQ++;
  if (currentQ < totalQ) loadQuestion();
  else showResult();
});

function showResult() {
  clearInterval(timerInterval);
  showScreen('resultScreen');
  const percent = Math.round((score / totalQ) * 100);
  document.getElementById('scoreValue').textContent = `${score}/${totalQ}`;
  document.getElementById('scorePercent').textContent = `${percent}%`;

  let msg = '', icon = 'fa-trophy';
  if (percent >= 80) { msg = "Outstanding! You're an Excel & IT expert! 🌟"; icon = 'fa-trophy'; }
  else if (percent >= 60) { msg = "Good job! Keep practicing! 💪"; icon = 'fa-medal'; }
  else if (percent >= 40) { msg = "Not bad! Review and try again. 📚"; icon = 'fa-book'; }
  else { msg = "Keep learning! You'll get there. 🚀"; icon = 'fa-rocket'; }

  document.getElementById('resultMessage').textContent = msg;
  document.getElementById('resultIcon').innerHTML = `<i class="fas ${icon}"></i>`;
}

document.getElementById('restartBtn').addEventListener('click', () => {
  currentQ = 0; score = 0; userAnswers = [];
  showScreen('startScreen');
});

document.getElementById('reviewBtn').addEventListener('click', () => {
  const container = document.getElementById('reviewContainer');
  container.innerHTML = '';
  questions.forEach((q, i) => {
    const ua = userAnswers[i];
    const isCorrect = ua === q.correct;
    const div = document.createElement('div');
    div.className = `review-item ${isCorrect ? 'correct' : 'wrong'}`;
    div.innerHTML = `
      <h4>Q${i+1}. ${q.q}</h4>
      <p class="correct-ans">✓ Correct: ${q.options[q.correct]}</p>
      ${!isCorrect ? `<p class="your-ans">✗ Your answer: ${ua !== null && ua !== undefined ? q.options[ua] : 'Not answered'}</p>` : ''}
    `;
    container.appendChild(div);
  });
  showScreen('reviewScreen');
});

document.getElementById('backToResult').addEventListener('click', () => showScreen('resultScreen'));