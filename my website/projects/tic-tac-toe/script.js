let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let gameMode = "pvp"; // "pvp" or "ai"

// Score tracking
let scoreX = 0;
let scoreO = 0;
let scoreDraws = 0;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

const cells = document.querySelectorAll(".cell");
const statusEl = document.getElementById("status");

/* ===== MODE SELECTION ===== */
function setMode(mode) {
  gameMode = mode;
  
  document.getElementById("pvpBtn").classList.toggle("active", mode === "pvp");
  document.getElementById("aiBtn").classList.toggle("active", mode === "ai");
  
  document.getElementById("playerOLabel").textContent = mode === "ai" ? "Computer" : "Player O";
  
  resetGame();
}

/* ===== CLICK HANDLER ===== */
cells.forEach(cell => cell.addEventListener("click", handleCellClick));

function handleCellClick() {
  const index = parseInt(this.getAttribute("data-index"));

  if (board[index] !== "" || !isGameActive) return;

  makeMove(index, currentPlayer);

  // AI Turn logic
  if (isGameActive && gameMode === "ai" && currentPlayer === "O") {
    statusEl.textContent = "Computer is thinking...";
    document.body.style.pointerEvents = "none"; // Disable clicks while AI thinks
    
    setTimeout(() => {
      document.body.style.pointerEvents = "auto";
      aiMove();
    }, 600);
  }
}

/* ===== MAKE MOVE ===== */
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());
  cells[index].classList.add("disabled");

  checkResult();
}

/* ===== CHECK RESULT ===== */
function checkResult() {
  let roundWon = false;
  let winningCells = [];

  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      winningCells = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    isGameActive = false;
    highlightWinner(winningCells);
    
    if (currentPlayer === "X") {
      scoreX++;
      document.getElementById("scoreX").textContent = scoreX;
    } else {
      scoreO++;
      document.getElementById("scoreO").textContent = scoreO;
    }
    
    statusEl.textContent = `${currentPlayer} Wins! 🎉`;
    statusEl.className = "status win";
    return;
  }

  if (!board.includes("")) {
    isGameActive = false;
    scoreDraws++;
    document.getElementById("scoreDraws").textContent = scoreDraws;
    statusEl.textContent = "It's a Draw! 🤝";
    statusEl.className = "status draw";
    return;
  }

  // Switch Player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();
}

function updateStatus() {
  statusEl.className = "status";
  if (gameMode === "ai" && currentPlayer === "O") {
    statusEl.textContent = `Computer's Turn`;
  } else {
    statusEl.textContent = `Player ${currentPlayer}'s Turn`;
  }
  
  // Highlight active score box
  document.querySelectorAll(".score-box").forEach(box => box.classList.remove("active"));
  document.querySelector(`.player-${currentPlayer.toLowerCase()}`).classList.add("active");
}

function highlightWinner(cellsToHighlight) {
  cellsToHighlight.forEach(i => {
    cells[i].classList.add("win");
  });
}

/* ===== SIMPLE AI LOGIC ===== */
function aiMove() {
  if (!isGameActive) return;

  // 1. Try to win
  let move = findBestMove("O");
  
  // 2. Try to block X
  if (move === -1) {
    move = findBestMove("X");
  }

  // 3. Take center
  if (move === -1 && board[4] === "") {
    move = 4;
  }

  // 4. Take random empty
  if (move === -1) {
    const emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
    if (emptyCells.length > 0) {
      move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }

  if (move !== -1) {
    makeMove(move, "O");
  }
}

function findBestMove(player) {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    const line = [board[a], board[b], board[c]];
    
    if (line.filter(v => v === player).length === 2 && line.includes("")) {
      // Find the empty index in this winning line
      if (board[a] === "") return a;
      if (board[b] === "") return b;
      if (board[c] === "") return c;
    }
  }
  return -1;
}

/* ===== RESET GAME ===== */
function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o", "win", "disabled");
  });

  updateStatus();
}