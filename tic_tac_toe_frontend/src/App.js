import React, { useState } from "react";
import "./App.css";

/**
 * Theme and color variables as per the requirements
 * Primary:   #1976D2 (board/grid/headers)
 * Secondary: #90CAF9 (O/circle, subtle backgrounds)
 * Accent:    #FFD600 (X/cross, highlight, buttons)
 */

// PUBLIC_INTERFACE
function App() {
  // Game board is an array of 9 values: null, "X", "O"
  const [board, setBoard] = useState(Array(9).fill(null));
  // "X" always starts
  const [xIsNext, setXIsNext] = useState(true);
  // null if game ongoing, "X"/"O" if win, "draw" for draw
  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return; // ignore if already filled or game over
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
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
        <PlayerAvatar player={xIsNext ? "X" : "O"} animate />
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderBoard() {
    return (
      <div className="board">
        {board.map((value, idx) => (
          <Square
            key={idx}
            value={value}
            highlight={winner && winner.line && winner.line.includes(idx)}
            onClick={() => handleClick(idx)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="app-outer">
      <main className="main-container">
        <h1 className="main-title">Tic Tac Toe</h1>
        {renderStatus()}
        {renderBoard()}
        <div className="control-bar">
          <button className="reset-btn" onClick={handleReset} aria-label="Reset game">
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
function Square({ value, highlight, onClick }) {
  return (
    <button
      className={`square${highlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell occupied by ${value}` : "Empty cell"}
      tabIndex={0}
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
 * Returns "X" or "O" if someone has won, or null if not.
 * For highlight, also returns .line with the indices of the winning line if any.
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

export default App;
