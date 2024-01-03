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

function Board({
  currentBoard,
  len,
  height,
  handleClick,
  handleHover,
  setMouseDown,
  setOff,
}) {
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
  const len = 25;
  const height = 25;

  const [currentBoard, setBoard] = useState(Array(len * height).fill(false));
  const [playing, setPlaying] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [isOff, setOff] = useState(null);
  const [intervalState, setIntervalState] = useState(null);

  function handleClick(x, y) {
    setOff(!currentBoard[x + y * len]);
    updateCell(x + y * len, currentBoard, len, height);

    // change current tile immediately
    const newBoard = currentBoard.slice();

    newBoard[x + y * len] = !currentBoard[x + y * len];
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

  // update entire board
  function updateBoard() {
    setBoard((oldBoard) => {
      const newBoard = oldBoard.slice();

      for (let i = 0; i < oldBoard.length; i++) {
        newBoard[i] = updateCell(i, oldBoard, len, height);
      }
      return newBoard;
    });
  }

  function clearBoard() {
    const newBoard = currentBoard.slice();

    for (let i = 0; i < currentBoard.length; i++) {
      newBoard[i] = false;
    }
    setBoard(newBoard);
  }

  function toggleGame() {
    if (playing) {
      clearInterval(intervalState);
    } else {
      const interval = setInterval(updateBoard, 50);
      setIntervalState(interval);
    }
    setPlaying((play) => !play);
  }

  return (
    <>
      <div style={{ height: "55px" }}>
        <p
          style={{
            color: "red",
            fontSize: "30px",
            fontFamily: "Comic Sans MS",
          }}
        >
          Conway's Game of Life
        </p>
      </div>
      <div style={{ height: "75px" }}>
        <button className="button" onClick={updateBoard}>
          {"Next generation"}
        </button>
        <button className="button" onClick={toggleGame}>
          {playing ? "Pause" : "Play"}
        </button>
        <button className="button" onClick={clearBoard}>
          {"Clear"}
        </button>
        <>RGB mode</>
        <input type="checkbox" id="myCheck" onclick="myFunction()"></input>
      </div>
      <div>
        <Board
          currentBoard={currentBoard}
          len={len}
          height={height}
          handleClick={handleClick}
          handleHover={handleHover}
          setMouseDown={setMouseDown}
          setOff={setOff}
        />
      </div>
    </>
  );
}

// see if cells are alive
function updateCell(position, currentBoard, len, height) {
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
      if (currentBoard[currentSquare]) {
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
