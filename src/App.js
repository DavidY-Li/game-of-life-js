import { useState } from "react";

function Cell({ alive, onCellPress, onCellHover }) {
  return (
    <button
      className="cell"
      onMouseDown={onCellPress}
      onMouseOver={onCellHover}
      style={{ backgroundColor: alive ? "black" : "white" }}
    ></button>
  );
}

function Board() {
  const len = 25;
  const height = 25;

  const [currentBoard, setBoard] = useState(Array(len * len).fill(false));
  const [mouseDown, setMouseDown] = useState(false);
  const [isOff, setOff] = useState(null);

  function handleClick(x, y) {
    setOff(!currentBoard[x + y * len]);
    checkAlive(x + y * len);

    // change current tile immediately
    const newBoard = currentBoard.slice();

    newBoard[x + y * len] = !currentBoard[x + y * len];
    setBoard(newBoard);
  }

  function updateBoard() {
    const newBoard = currentBoard.slice();

    for (let i = 0; i < currentBoard.length; i++) {
      newBoard[i] = checkAlive(i);
    }
    setBoard(newBoard);
  }

  function handleHover(x, y) {
    // check if mouse is pressed and tile isn't already in correct state
    if (!mouseDown || currentBoard[x + y * len] == isOff) return;

    // change current tile
    const newBoard = currentBoard.slice();

    newBoard[x + y * len] = isOff;
    setBoard(newBoard);
  }

  // see if cells are alive
  function checkAlive(position) {
    // get x and y from absolute position
    let x = position % len;
    let y = Math.floor(position / len);
    let around = 0;

    // iterate through all around
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i == 0 && j == 0) {
          continue;
        }

        // get current squarecurrentSquare
        // modulo in js is weird for negatives :/
        let currentSquare =
          ((((x + i) % len) + len) % len) +
          ((((y + j) % height) + height) % height) * height;

        // update count
        if (currentBoard[currentSquare] == true) {
          around++;
        }
      }
    }

    if (currentBoard[position] == true && (around == 2 || around == 3)) {
      return true;
    } else if (currentBoard[position] == false && around == 3) {
      return true;
    } else {
      return false; // die
    }
  }

  // size
  const rows = [...Array(len).keys()];
  const cols = [...Array(height).keys()];

  const board = cols.map((col) => (
    <div className="board-row" key={"cols: " + col}>
      {rows.map((row) => (
        <Cell
          alive={currentBoard[row + col * len]}
          onCellHover={() => handleHover(row, col)}
          onCellPress={() => handleClick(row, col)}
          key={row + col * len}
        />
      ))}
    </div>
  ));

  return (
    <>
      <div
        className="board-row"
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => {
          setMouseDown(false);
          setOff(null);
        }}
      >
        {board}
      </div>
    </>
  );
}

export default function Game() {
  const [playing, setPlaying] = useState(false);

  function toggleGame() {
    setPlaying((play) => !play);
  }

  return (
    <>
      <button onClick={toggleGame}>{playing ? "Play" : "Pause"}</button>

      <div>
        <Board />
      </div>
    </>
  );
}
