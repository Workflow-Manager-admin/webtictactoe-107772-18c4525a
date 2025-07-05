import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 *
 * Main App component for Tic Tac Toe.
 * Now supports two game modes: Human vs Human, and Human vs Computer (AI).
 * - Players may select the mode using a toggle at the top.
 * - Game continues to support reset, current turn display, and result detection.
 */

/**
 * PUBLIC_INTERFACE
 * The main Tic Tac Toe game. Exported for routing.
 */
function TicTacToeGame() {
  // Game mode: "HUMAN" = 2 player local, "AI" = play against computer
  const [mode, setMode] = useState("HUMAN"); // Default to Human vs Human
  // Board state: Array of 9 values: null, "X", "O"
  const [board, setBoard] = useState(Array(9).fill(null));
  // "X" always starts
  const [xIsNext, setXIsNext] = useState(true);
  // Used for disabling click during computer move (for user experience)
  const [isAITurn, setIsAITurn] = useState(false);

  // Game status
  const winnerObj = calculateWinner(board); // object | null
  const winner = winnerObj ? (typeof winnerObj === "string" ? winnerObj : winnerObj.result) : null;
  const isDraw = !winner && board.every((cell) => cell);

  // Current player logic
  const currentPlayer = xIsNext ? "X" : "O";
  const isAIEnabled = mode === "AI";
  // In AI mode: Human is always X, Computer is O (O goes second)
  const isAITurnToMove = isAIEnabled && !winner && !isDraw && !xIsNext;

  /** AI move hook (reacts whenever AI needs to make a move) */
  useEffect(() => {
    if (isAITurnToMove) {
      setIsAITurn(true);
      // Use a short delay for realism
      const timeout = setTimeout(() => {
        const bestMoveIdx = findBestMove(board, "O", "X");
        if (typeof bestMoveIdx === "number") {
          makeMove(bestMoveIdx, "O");
        }
        setIsAITurn(false);
      }, 500); // 0.5s delay for more lifelike feel
      return () => clearTimeout(timeout); // cleanup on redraw
    }
  // eslint-disable-next-line
  }, [isAITurnToMove, board]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner || (isAIEnabled && !xIsNext)) return;
    makeMove(idx, currentPlayer);
  }

  // PUBLIC_INTERFACE
  function makeMove(idx, player) {
    const nextBoard = board.slice();
    nextBoard[idx] = player;
    setBoard(nextBoard);
    setXIsNext(player === "X" ? false : true);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setIsAITurn(false);
  }

  // PUBLIC_INTERFACE
  function handleModeChange(e) {
    const newMode = e.target.value;
    setMode(newMode);
    // Reset game when the mode switches
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setIsAITurn(false);
  }

  // PUBLIC_INTERFACE
  function renderStatus() {
    if (winner) {
      return (
        <div className="game-result">
          <span className="winner-text">
            <PlayerAvatar player={winner} large /> wins!
          </span>
        </div>
      );
    }
    if (isDraw) {
      return <div className="game-result draw-text">It&apos;s a draw!</div>;
    }
    return (
      <div className="turn-header">
        <span className="subtitle">Current Turn:</span>{" "}
        <PlayerAvatar player={currentPlayer} animate={!isAIEnabled || xIsNext} />
        {isAIEnabled && (
          <span style={{ marginLeft: "0.6em", color: "#888", fontSize: "1rem" }}>
            {xIsNext ? "You" : "Computer"}
          </span>
        )}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderBoard() {
    const highlightLine = winnerObj && winnerObj.line ? winnerObj.line : [];
    return (
      <div className="board">
        {board.map((value, idx) => (
          <Square
            key={idx}
            value={value}
            highlight={highlightLine.includes(idx)}
            onClick={() => handleClick(idx)}
            disabled={Boolean(board[idx]) || winner || (isAIEnabled && !xIsNext)}
            tabIndex={0}
          />
        ))}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderModeSelector() {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1em" }}>
        <label style={{ marginRight: "1.2em", fontWeight: 500, color: "#191c1f" }}>
          <input
            type="radio"
            name="gamemode"
            value="HUMAN"
            checked={mode === "HUMAN"}
            onChange={handleModeChange}
            style={{ marginRight: "0.5em" }}
            aria-label="Two player mode"
          />
          Two Player
        </label>
        <label style={{ fontWeight: 500, color: "#191c1f" }}>
          <input
            type="radio"
            name="gamemode"
            value="AI"
            checked={mode === "AI"}
            onChange={handleModeChange}
            style={{ marginRight: "0.5em" }}
            aria-label="Play against computer"
          />
          Play vs Computer
        </label>
      </div>
    );
  }

  return (
    <div className="app-outer">
      <main className="main-container">
        <h1 className="main-title">Tic Tac Toe</h1>
        {renderModeSelector()}
        {renderStatus()}
        {renderBoard()}
        <div className="control-bar">
          <button
            className="reset-btn"
            onClick={handleReset}
            aria-label="Reset game"
            disabled={isAITurn}
          >
            Reset
          </button>
        </div>
      </main>
      <footer className="footer-note">
        <span>
          <a
            href="https://reactjs.org/"
            className="footer-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with React
          </a>
        </span>
      </footer>
    </div>
  );
}

/**
 * Game Square component
 * PUBLIC_INTERFACE
 */
function Square({ value, highlight, onClick, disabled }) {
  return (
    <button
      className={`square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell occupied by ${value}` : "Empty cell"}
      tabIndex={0}
      disabled={disabled}
    >
      <PlayerAvatar player={value} />
    </button>
  );
}

/**
 * PlayerAvatar renders either an "X" or "O" with appropriate styling
 * PUBLIC_INTERFACE
 */
function PlayerAvatar({ player, animate = false, large = false }) {
  if (player === "X") {
    // Accent - bold yellow X
    return (
      <span
        className={`player-x${large ? " large" : ""}${animate ? " pulse" : ""}`}
        style={{ color: "#FFD600" }}
      >
        X
      </span>
    );
  }
  if (player === "O") {
    // Secondary - bold blue O
    return (
      <span
        className={`player-o${large ? " large" : ""}${animate ? " pulse" : ""}`}
        style={{ color: "#1976D2" }}
      >
        O
      </span>
    );
  }
  return null;
}

/**
 * Calculates winner for current board state.
 * Returns { result, line } if someone has won, or null if not.
 * PUBLIC_INTERFACE
 */
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a] &&
      board[a] === board[b] &&
      board[a] === board[c]
    ) {
      return { result: board[a], line, toString: () => board[a] }; // compatible with usages
    }
  }
  return null;
}

/**
 * AI Logic: Find the best move for "O" (computer)
 * PUBLIC_INTERFACE
 */
function findBestMove(board, aiPlayer, humanPlayer) {
  // First: if center is open, take it
  if (!board[4]) return 4;
  // Try to win if possible
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = board.slice();
      newBoard[i] = aiPlayer;
      if (calculateWinner(newBoard)) return i;
    }
  }
  // Try to block opponent win
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = board.slice();
      newBoard[i] = humanPlayer;
      if (calculateWinner(newBoard)) return i;
    }
  }
  // Otherwise pick a random empty cell (fallback instead of minimax for speed)
  const emptyCells = [];
  for (let i = 0; i < 9; i++) {
    if (!board[i]) emptyCells.push(i);
  }
  if (emptyCells.length === 0) return undefined;
  // Prioritize corners over sides for a bit more challenge
  const corners = [0, 2, 6, 8].filter((idx) => emptyCells.includes(idx));
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  // Any available spot
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

export default TicTacToeGame;
export { TicTacToeGame };
