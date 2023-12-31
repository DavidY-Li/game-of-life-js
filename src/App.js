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
  var len = 25;
  var height = 25;

  const [currentBoard, setBoard] = useState(Array(len * len).fill(false));
  const [mouseDown, setMouseDown] = useState(false);
  const [isOff, setOff] = useState(null);

  function handleClick(x, y) {
    setOff(!currentBoard[x + y * len]);

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
  function checkLife() {
    
  }

  return (
    <>
      <div>
        <Board />
      </div>
    </>
  );
}
