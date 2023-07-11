// Date: 2021/09/26
// Author: Michał Dembiński
// Description: Main file of the project
import "./App.css";
import { useEffect, useState } from "react";

const numRows = 40;
const numCols = 40;

function App() {
  const [density, setDensity] = useState(0.5);
  const [iterations, setIterations] = useState(0);
  const [grid, setGrid] = useState(() => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    return rows;
  });

  useEffect(() => {}, [grid]);

  const generateRandomGrid = () => {
    const gridCopy = [...grid];
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        gridCopy[i][j] = Math.random() < density ? 1 : 0;
      }
    }
    return gridCopy;
  };

  const countNeighbours = (grid, row, col) => {
    let neighbours = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (
          row + i >= 0 &&
          row + i < numRows &&
          col + j >= 0 &&
          col + j < numCols
        ) {
          if (grid[row + i][col + j] == 1) {
            neighbours++;
          }
        }
      }
    }
    return neighbours;
  };

  const simul = (oldGrid) => {
    let newGrid = [];
    for (let i = 0; i < numRows; i++) {
      newGrid.push([]);
      for (let j = 0; j < numCols; j++) {
        if (oldGrid[i][j] == 0) {
          let neighbours = countNeighbours(oldGrid, i, j);
          if (neighbours > 4) {
            newGrid[i][j] = 1;
          } else {
            newGrid[i][j] = 0;
          }
        } else {
          newGrid[i][j] = 1;
        }
      }
    }
    return newGrid;
  };

  const regenerate = () => {
    let newGrid = generateRandomGrid();
    let oldGrid = [...newGrid];
    for (let i = 0; i < iterations; i++) {
      newGrid = simul(oldGrid);
      oldGrid = [...newGrid];
    }
    setGrid(newGrid);
  };

  const nextStep = () => {
    const oldGrid = [...grid];
    const newGrid = simul(oldGrid);
    setGrid(newGrid);
  };

  const iterationsChangeHandler = (event) => {
    setIterations(event.target.value);
    regenerate();
  };

  const densityChangeHandler = (event) => {
    setDensity(event.target.value);
    regenerate();
  };

  return (
    <div className="App">
      <div className="App-header">
        <h1>Cellular Automata Generation</h1>
        <div
          className="App-body"
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div className="Control-panel">
            <div className="Control">
              <label>Density</label>
              <input
                type="number"
                min={0}
                max={1}
                step={0.1}
                value={density}
                onChange={(e) => {
                  densityChangeHandler(e);
                }}
              ></input>
            </div>
            <div className="Control">
              <label>Iterations</label>
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={iterations}
                onChange={(e) => {
                  iterationsChangeHandler(e);
                }}
              ></input>
            </div>
            <div className="Control">
              <button type="button" onClick={() => regenerate()}>
                Regenerate
              </button>
            </div>
            <div className="Control">
              <button type="button" onClick={() => nextStep()}>
                Next step
              </button>
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numCols}, 15px)`,
              margin: 50,
            }}
          >
            {grid.map((rows, i) =>
              rows.map((col, j) => (
                <div
                  key={`${i}-${j}`}
                  style={{
                    width: 15,
                    height: 15,
                    backgroundColor: grid[i][j] ? "orange" : "gray",
                    border: "solid 1px black",
                  }}
                ></div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
