import React, { useState } from 'react';

const numRows = 4;
const numCols = 4;

function Square({value, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={onSquareClick}
    >{value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, numRows, numCols }) {
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
    for (let i = 0; i < numRows; i++) {
      let row = [];
      for (let j = 0; j < numCols; j++) {
        row.push(
          <Square value={squares[i * numRows + j]} onSquareClick={() => handleClick(i * numRows + j)} />
        );
      }
      board.push(<div className="board-row">{row}</div>);
    }
    return board;
  };

  return (
    <div>
      <div className="status">{status}</div>
      {createBoard(numRows, numCols)}
    </div>
  );
}

function MoveList({ moves, incOrder, onOrder }) {
  return (
    <div>
      <button onClick={() => onOrder(moves)}>Change Order of Display</button>
      <ol reversed={incOrder ? null : true}>{moves}</ol>
    </div>
  );
}

export default function Game() {
  //const [numRows, setNumRows] = useState(4);
  //const [numCols, setNumCols] = useState(4);
  //const numRows = 4;
  //const numCols = 4;
  const [history, setHistory] = useState([Array(numRows * numCols).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [incOrder, setIncOrder] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [].concat(history.slice(0, currentMove + 1), [nextSquares]);
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleOrder(moves) {
    console.log(incOrder, "moves: ", moves);
    setIncOrder(!incOrder);
    moves = moves.slice().reverse();
    console.log(incOrder, "moves reversed: ", moves);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((iterator, move) => {
    let description;
    let accMove;
    if (incOrder) {
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

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} numRows={numRows} numCols={numCols} />
      </div>
      <div className="game-info">
        <MoveList moves={moves} incOrder={incOrder} setIncOrder={setIncOrder} onOrder={handleOrder} />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  // check if draw
  if (!squares.includes(null)) {
    return "Draw";
  }

  loop1: // continues outer loop
  for (let i = 0; i < numRows; i++) { // checks rows for winner
    if (squares[i * numCols] === null) {
      continue;
    }
    for (let j = 0; j < numCols; j++) {
      if (squares[i * numCols] !== squares[i * numCols + j]) {
        continue loop1;
      }
    }
    return ("By rows: " + squares[i * numCols]);
  }

  loop2: // continues outer loop
  for (let i = 0; i < numCols; i++) { // checks cols for winner
    if (squares[i] === null) {
      continue;
    }
    for (let j = 0; j < numRows; j++) {
      if (squares[i + j * numCols] !== squares[i]) {
        continue loop2;
      }
    }
    return ("By columns: " + squares[i]);
  }
  
  // checks diag for winner
  if (numRows === numCols) {
    let hasDiagWinner = true;
    if (squares[0] !== null) {
      for (let i = 0; i < numRows; i++) {
        if (squares[i * (numRows + 1)] !== squares[0]) {
          hasDiagWinner = false;
        }
      }
      if (hasDiagWinner === true) {
        return ("By first diagonal: " + squares[0]);
      }
    }
    hasDiagWinner = true;
    if (squares[numCols - 1] !== null) {
      for (let i = 1; i <= numRows; i++) {
        if (squares[i * (numCols - 1)] !== squares[numCols - 1]) {
          hasDiagWinner = false;
        }
      }
      if (hasDiagWinner === true) {
        return ("By second diagonal: " + squares[numCols - 1]);
      }
    }
  }
  return null;
}
