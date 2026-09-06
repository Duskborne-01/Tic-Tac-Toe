import { findBestMove } from "./main.js";

const cross = Object.assign(new Image(), {
  src: "../svg/cross.svg",
  id: "icon",
  draggable: false,
});

const circle = Object.assign(new Image(), {
  src: "../svg/circle.svg",
  id: "icon",
  draggable: false,
});

const gameDelay = 1000;
const rules = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const iconMap = { X: cross, O: circle };

let grid = new Array(9).fill("");
let currentPlayer = "X";
let gameFrozen = false;
let gameMode = "PvAI";
let gameModeQueue;

for (let index = 0; index < 9; index++) {
  const cell = document.createElement("div");
  cell.id = `C${index}`;
  cell.className = "cell";
  cell.style.gridArea = `C${index}`;
  document.getElementById("board").appendChild(cell);
  cell.addEventListener("mousedown", () => handleCellClick(index));
}

function renderToDOM() {
  for (let i = 0; i < 9; i++) {
    const cell = document.getElementById(`C${i}`);

    while (cell.firstChild) cell.removeChild(cell.firstChild);

    if (grid[i] !== "") {
      cell.appendChild(iconMap[grid[i]].cloneNode(false));
    }
  }
}

function print(value) {
  document.getElementById("output").textContent = value || "";
}

function checkWin(board = grid) {
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    if (
      board[rule[0]] !== "" &&
      board[rule[0]] === board[rule[1]] &&
      board[rule[1]] === board[rule[2]]
    ) {
      return {
        finished: true,
        winner: board[rule[0]],
        winCase: rule,
        tie: false,
      };
    }
  }

  const tie = board.every((cell) => cell !== "");

  return {
    finished: tie,
    winner: tie ? "tie" : null,
    winCase: [],
    tie,
  };
}

function reset() {
  print("Loading...");

  setTimeout(() => {
    gameFrozen = false;
    grid = new Array(9).fill("");
    currentPlayer = "X";

    if (gameModeQueue) {
      gameMode = gameModeQueue;
      gameModeQueue = undefined;
    }

    document.getElementById("selector").textContent = gameMode;
    renderToDOM();
    print("");
  }, gameDelay);
}

function update() {
  const gameState = checkWin();

  if (gameState.finished && !gameState.tie) {
    gameFrozen = true;
    print(`${gameState.winner} won this round!`);

    for (let index = 0; index < 9; index++) {
      if (gameState.winCase.includes(index)) continue;

      const icon = document.getElementById(`C${index}`).firstChild;
      if (icon) icon.style.filter = "invert(1) brightness(0.2)";
    }

    setTimeout(reset, gameDelay);
    return;
  }

  if (gameState.tie) {
    gameFrozen = true;
    print("This round is a tie!");
    setTimeout(reset, gameDelay);
  }
}

function handleCellClick(index) {
  if (grid[index] !== "" || gameFrozen) return;

  grid[index] = currentPlayer;
  renderToDOM();

  const gameState = checkWin();
  if (gameState.finished) {
    update();
    return;
  }

  if (gameMode === "PvAI" && currentPlayer === "X") {
    currentPlayer = "O";
    pickAIMove();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  update();
}

function pickAIMove() {
  if (currentPlayer !== "O" || gameFrozen) return;

  gameFrozen = true;

  setTimeout(() => {
    const bestMove = findBestMove(grid);

    if (bestMove !== undefined && bestMove !== null) {
      grid[bestMove] = "O";
    }

    currentPlayer = "X";
    gameFrozen = false;
    renderToDOM();
    update();
  }, gameDelay * 0.3);
}

document.getElementById("selector").addEventListener("mousedown", () => {
  const newGameMode = gameMode === "PvAI" ? "PvP" : "PvAI";
  gameModeQueue = newGameMode;
  document.getElementById("selector").textContent = newGameMode;
});

export { checkWin };