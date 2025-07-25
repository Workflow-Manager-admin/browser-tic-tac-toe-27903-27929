import React, { useState, useMemo } from 'react';
import './App.css';

/**
 * MODERN TIC TAC TOE - PLAYER VS PLAYER
 * Features:
 * - Responsive, centered board
 * - Reset button in header
 * - Winner/Draw announcement
 * - Modern, minimalistic light theme with given palette
 */

// Color palette as JS vars for inline styles etc.
const COLORS = {
  primary: "#1976d2",
  secondary: "#90caf9",
  accent: "#ff5252",
  bg: "#fff"
};

// Calculate winner or null if no winner
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns {winner: 'X'|'O', line: [idx...]} | null */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // columns
    [0,4,8],[2,4,6]          // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a,b,c]};
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Game state: 9 squares, whose turn, winner
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  // Derive game status
  const winnerData = useMemo(() => calculateWinner(squares), [squares]);
  const movesPlayed = squares.filter(Boolean).length;
  const isDraw = !winnerData && movesPlayed === 9;
  const statusMessage = useMemo(() => {
    if (winnerData) {
      return `Winner: ${winnerData.winner}`;
    } else if (isDraw) {
      return "It's a draw!";
    } else {
      return `Next turn: ${xIsNext ? "X" : "O"}`;
    }
  }, [winnerData, isDraw, xIsNext]);

  // Click handler for a square
  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    if (squares[i] || winnerData) return; // Block after win or on played cell
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // Render one tic-tac-toe cell; highlight if part of win
  function Square({value, onClick, highlight}) {
    // modern minimal: remove button outline, use palette, sharp hover, slight box-shadow
    return (
      <button
        className={`ttt-square${highlight ? " highlight" : ""}`}
        onClick={onClick}
        aria-label={value ? `Occupied by ${value}` : "Empty"}
        tabIndex={value ? -1 : 0}
        disabled={Boolean(value) || Boolean(winnerData)}
      >
        {value}
      </button>
    );
  }

  // Build board: 3x3
  function Board() {
    let board = [];
    for (let r = 0; r < 3; ++r) {
      let row = [];
      for (let c = 0; c < 3; ++c) {
        const idx = r * 3 + c;
        const highlight = !!(winnerData && winnerData.line.includes(idx));
        row.push(
          <Square
            key={idx}
            value={squares[idx]}
            onClick={() => handleSquareClick(idx)}
            highlight={highlight}
          />
        );
      }
      board.push(
        <div key={r} className="ttt-row">{row}</div>
      );
    }
    return <div className="ttt-board">{board}</div>;
  }

  return (
    <div className="ttt-root">
      {/* Header bar */}
      <div className="ttt-header" style={{ background: COLORS.primary, color: "#fff" }}>
        <div className="ttt-title">
          Tic Tac Toe
        </div>
        <button className="ttt-reset-btn"
          style={{
            background: COLORS.accent,
            color: "#fff"
          }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      {/* Main content, centered */}
      <main className="ttt-center">
        <Board />
      </main>
      {/* Footer: winner/draw */}
      <footer className="ttt-footer">
        <span
          data-testid="ttt-status"
          style={{
            color: winnerData
              ? COLORS.accent
              : isDraw
                ? COLORS.primary
                : COLORS.primary,
            fontWeight: winnerData || isDraw ? 700 : 500,
            letterSpacing: '0.01em'
          }}
        >
          {statusMessage}
        </span>
      </footer>
    </div>
  );
}

export default App;
