import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('Tic Tac Toe App', () => {
  test('renders the main title', () => {
    render(<App />);
    const title = screen.getByText(/tic tac toe/i);
    expect(title).toBeInTheDocument();
  });

  test('can make moves in Two Player mode and detects win', () => {
    render(<App />);
    // Board squares are buttons, default to empty
    const squares = screen.getAllByRole('button', {name: /empty cell/i});
    // X moves top left
    fireEvent.click(squares[0]);
    // O moves top center
    fireEvent.click(squares[1]);
    // X moves middle left
    fireEvent.click(squares[3]);
    // O moves middle center
    fireEvent.click(squares[4]);
    // X moves bottom left (win)
    fireEvent.click(squares[6]);
    // Should display X wins
    const winText = screen.getByText(/wins/i);
    expect(winText).toBeInTheDocument();
    expect(winText.textContent.toLowerCase()).toContain("x");
  });

  test('reset button clears the board', () => {
    render(<App />);
    const squares = screen.getAllByRole('button', {name: /empty cell/i});
    // Play a move
    fireEvent.click(squares[0]);
    // Find and click reset
    const resetBtn = screen.getByRole('button', { name: /reset/ });
    fireEvent.click(resetBtn);
    // Now all cells should revert to empty
    expect(screen.getAllByRole('button', {name: /empty cell/i}).length).toBe(9);
  });

  test('can toggle to AI mode and computer plays (O)', async () => {
    render(<App />);
    // Toggle AI mode
    const aiRadio = screen.getByRole('radio', { name: /play against computer/i });
    fireEvent.click(aiRadio);

    // Human (X) moves to a non-center (avoid instant draw/win)
    let squares = screen.getAllByRole('button', {name: /empty cell/i});
    fireEvent.click(squares[0]);

    // Wait for AI move (after ~0.5s). Board should now have an "O".
    // Instead of setTimeout, use findBy... which internally waits
    const oMark = await screen.findByText('O', {}, {timeout: 1500});
    expect(oMark).toBeInTheDocument();
  });
});
