import React from 'react'
import { useState } from 'react';

const _numRows = 3; // number of rows in the board
const _numCols = 3; // number of columns in the board

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
    if (winner === 'Draw') {
      status = 'Draw';
    } else {
      status = 'Winner: ' + winner;
    }
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const createBoard = () => {
    let board = [];
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
  // check if draw
  if (!squares.includes(null)) {
    return "Draw";
  }

  loop1: // continues outer loop
  for (let i = 0; i < _numRows; i++) { // checks rows for winner
    if (squares[i * _numCols] === null) {
      continue;
    }
    for (let j = 0; j < _numCols; j++) {
      if (squares[i * _numCols] !== squares[i * _numCols + j]) {
        continue loop1;
      }
    }
    return ("By rows: " + squares[i * _numCols]);
  }

  loop2: // continues outer loop
  for (let i = 0; i < _numCols; i++) { // checks cols for winner
    if (squares[i] === null) {
      continue;
    }
    for (let j = 0; j < _numRows; j++) {
      if (squares[i + j * _numCols] !== squares[i]) {
        continue loop2;
      }
    }
    return ("By columns: " + squares[i]);
  }

  //let diagSquares = [];
  //for (let i = 0; i < 3; i++) {
  //  diagSquares.push(i * (3+1));
  //}
  
  // checks diag for winner
  if (_numRows === _numCols) {
    let hasDiagWinner = true;
    if (squares[0] !== null) {
      for (let i = 0; i < _numRows; i++) {
        if (squares[i * (_numRows + 1)] !== squares[0]) {
          hasDiagWinner = false;
        }
      }
      if (hasDiagWinner === true) {
        return ("By first diagonal: " + squares[0]);
      }
    }
    hasDiagWinner = true;
    if (squares[_numCols - 1] !== null) {
      for (let i = 1; i <= _numRows; i++) {
        if (squares[i * (_numCols - 1)] !== squares[_numCols - 1]) {
          hasDiagWinner = false;
        }
      }
      if (hasDiagWinner === true) {
        return ("By second diagonal: " + squares[_numCols - 1]);
      }
    }
  }
  return null;
}
