import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

// PUBLIC_INTERFACE
/**
 * Home page displaying game cards for navigation.
 * - "Tic Tac Toe" card navigates to game
 * - "Snake and Ladder" shows as Coming Soon
 */
function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-outer home-bg">
      <main className="main-container">
        <h1 className="main-title">Welcome to Classic Games!</h1>
        <div className="game-card-grid">
          <div
            className="game-card"
            onClick={() => navigate("/tictactoe")}
            tabIndex={0}
            role="button"
            aria-label="Play Tic Tac Toe"
            style={{ cursor: "pointer" }}
          >
            <div className="game-card-header">
              <span className="game-icon ttt">◻️◼️</span>
              <span className="game-title">Tic Tac Toe</span>
            </div>
            <div className="game-desc">
              Enjoy a quick classic: challenge a friend or computer!
            </div>
            <span className="game-cta">Play Now →</span>
          </div>
          <div
            className="game-card disabled"
            aria-label="Snake and Ladder (Coming Soon)"
            tabIndex={-1}
          >
            <div className="game-card-header">
              <span className="game-icon snl" aria-hidden>🎲</span>
              <span className="game-title">Snake &amp; Ladder</span>
              <span className="coming-soon">Coming Soon</span>
            </div>
            <div className="game-desc">
              Race to the top, dodge snakes, climb ladders. Available soon!
            </div>
            <span className="game-cta" aria-hidden>
              Stay Tuned
            </span>
          </div>
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

export default Home;
