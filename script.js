const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const swapBtn = document.getElementById("swap");

const IMG = {
  X: "x.png",
  O: "o.png",
};

let startPlayer = "X";
let currentPlayer = startPlayer;
let board = Array(9).fill(null);
let gameOver = false;

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

function setStatus(text){
  statusEl.textContent = text;
}

function resetGame(){
  board = Array(9).fill(null);
  gameOver = false;
  currentPlayer = startPlayer;

  document.querySelectorAll(".cell").forEach(cell => {
    cell.innerHTML = "";
    cell.classList.remove("winner");
    cell.disabled = false;
  });

  setStatus(`${currentPlayer} goes first`);
}

function placeMark(index, cellEl){
  board[index] = currentPlayer;

  const img = document.createElement("img");
  img.alt = currentPlayer;
  img.src = IMG[currentPlayer];
  cellEl.appendChild(img);

  cellEl.disabled = true;
}

function findWinner(){
  for (const line of WIN_LINES){
    const [a,b,c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]){
      return { player: board[a], line };
    }
  }
  return null;
}

function endGame(winner){
  gameOver = true;
  document.querySelectorAll(".cell").forEach(cell => cell.disabled = true);

  if (winner){
    winner.line.forEach(i => {
      document.querySelector(`.cell[data-i="${i}"]`).classList.add("winner");
    });
    setStatus(`${winner.player} wins!`);
  } else {
    setStatus("Draw.");
  }
}

boardEl.addEventListener("click", (e) => {
  const cell = e.target.closest(".cell");
  if (!cell || gameOver) return;

  const i = Number(cell.dataset.i);
  if (board[i]) return;

  placeMark(i, cell);

  const winner = findWinner();
  if (winner) return endGame(winner);

  if (board.every(Boolean)) return endGame(null);

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  setStatus(`${currentPlayer}'s turn`);
});

restartBtn.addEventListener("click", resetGame);

swapBtn.addEventListener("click", () => {
  startPlayer = startPlayer === "X" ? "O" : "X";
  resetGame();
});

// init
resetGame();
