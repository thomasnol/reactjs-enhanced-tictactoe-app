import React from 'react'
import { useState } from 'react';

function Square({value, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >{value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] !== null || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext === true) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const createBoard = () => {
    let board = [];
    const _numRows = 3;
    const _numCols = 3;
    for (let i = 0; i < _numRows; i++) {
      let row = [];
      for (let j = 0; j < _numCols; j++) {
        row.push(
          <Square value={squares[i * _numRows + j]} onSquareClick={() => handleClick(i * _numRows + j)} />
        );
      }
      board.push(<div className="board-row">{row}</div>);
    }
    return board;
  };

  return (
    <div>
      <div className="status">{status}</div>
      {createBoard()}
    </div>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [incOrder, setIncOrder] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [].concat(history.slice(0, currentMove + 1), [nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((iterator, move) => {
    let description;
    let accMove = 0;
    if (incOrder === true) {
      accMove = move;
    } else {
      accMove = history.length - move - 1;
    }
    if (accMove === currentMove) {
      description = 'You are on move #' + accMove;
      return (
        <li key={accMove}>
          <div>{description}</div>
        </li>
      );
    }
    if (accMove > 0) {
      description = 'Go to move #' + accMove;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={accMove}>
        <button onClick={() => jumpTo(accMove)}>{description}</button>
      </li>
    );
  });

  if (incOrder === true) {
    return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
        <div>
          <button onClick={() => setIncOrder(!incOrder)}>Change Order of Display</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol reversed>{moves}</ol>
        </div>
        <div>
          <button onClick={() => setIncOrder(!incOrder)}>Change Order of Display</button>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
