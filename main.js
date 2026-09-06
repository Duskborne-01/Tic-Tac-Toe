const checkWin = (board) => {
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
        tie: false,
      };
    }
  }

  const tie = board.every((cell) => cell !== "");

  return {
    finished: tie,
    winner: tie ? "tie" : null,
    tie,
  };
};

const minimax = (board, maximizingPlayer) => {
  const gameState = checkWin(board);

  if (gameState.finished) {
    if (gameState.tie) return 0;
    return gameState.winner === "O" ? 1 : -1;
  }

  if (maximizingPlayer) {
    let value = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (board[i] !== "") continue;

      board[i] = "O";
      value = Math.max(value, minimax(board, false));
      board[i] = "";
    }

    return value;
  }

  let value = Infinity;

  for (let i = 0; i < 9; i++) {
    if (board[i] !== "") continue;

    board[i] = "X";
    value = Math.min(value, minimax(board, true));
    board[i] = "";
  }

  return value;
};

const findBestMove = (board) => {
  let bestScore = -Infinity;
  let bestMove = undefined;

  for (let i = 0; i < 9; i++) {
    if (board[i] !== "") continue;

    board[i] = "O";
    const score = minimax(board, false);
    board[i] = "";

    if (score > bestScore) {
      bestScore = score;
      bestMove = i;
    }
  }

  return bestMove;
};

export { findBestMove, checkWin };