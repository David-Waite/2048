import "./styles/App.css";
import Tile from "./components/Tile";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

function App() {
  const [bestScore, setBestScore] = useState(localStorage.getItem("best"));
  const [score, setScore] = useState(0);
  const [currentRoundScore, setCurrentRoundScore] = useState(0);
  const [inProcess, setInProcess] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [animation, setAnimation] = useState(true);
  const [layout, setLayout] = useState({
    num1: { value: 0, position: "a1" },
    num2: { value: 0, position: "b1" },
    num3: { value: 0, position: "c1" },
    num4: { value: 0, position: "d1" },
    num5: { value: 0, position: "a2" },
    num6: { value: 0, position: "b2" },
    num7: { value: 0, position: "c2" },
    num8: { value: 0, position: "d2" },
    num9: { value: 0, position: "a3" },
    num10: { value: 0, position: "b3" },
    num11: { value: 0, position: "c3" },
    num12: { value: 0, position: "d3" },
    num13: { value: 0, position: "a4" },
    num14: { value: 0, position: "b4" },
    num15: { value: 0, position: "c4" },
    num16: { value: 0, position: "d4" },
  });

  const keys = Object.keys(layout);

  useEffect(() => {
    if (score >= bestScore) {
      setBestScore(score);
      localStorage.setItem("best", score);
    }
  }, [score]);

  useEffect(() => {
    for (let key in layout) {
      if (layout[key].value === 0) {
        return;
      }
    }
    checkForGameOver();
  }, [layout]);
  useEffect(() => {
    if (!gameOver) {
      setScore(0);
      let newLayout = {
        num1: { value: 0, position: "a1" },
        num2: { value: 0, position: "b1" },
        num3: { value: 0, position: "c1" },
        num4: { value: 0, position: "d1" },
        num5: { value: 0, position: "a2" },
        num6: { value: 0, position: "b2" },
        num7: { value: 0, position: "c2" },
        num8: { value: 0, position: "d2" },
        num9: { value: 0, position: "a3" },
        num10: { value: 0, position: "b3" },
        num11: { value: 0, position: "c3" },
        num12: { value: 0, position: "d3" },
        num13: { value: 0, position: "a4" },
        num14: { value: 0, position: "b4" },
        num15: { value: 0, position: "c4" },
        num16: { value: 0, position: "d4" },
      };

      let keys = Object.keys(newLayout);
      let randomKey1 = keys[Math.floor(Math.random() * keys.length)];
      let randomKey2 = keys[Math.floor(Math.random() * keys.length)];

      while (randomKey1 === randomKey2) {
        randomKey2 = keys[Math.floor(Math.random() * keys.length)];
      }

      newLayout[randomKey1].value = Math.random() < 0.9 ? 2 : 4;
      newLayout[randomKey2].value = Math.random() < 0.9 ? 2 : 4;

      setLayout(newLayout);
    }
  }, [gameOver]);

  document.onkeydown = checkKey;

  function combineObjects(objects, noScore) {
    let zeroValues = 0;
    let combinedValues = 0;
    let returnArray = Array(4);

    outerLoop: for (
      let outerLoopPostion = 3;
      outerLoopPostion >= 0;
      outerLoopPostion--
    ) {
      if (objects[outerLoopPostion].value === 0) {
        zeroValues++;

        continue;
      }
      if (outerLoopPostion === 0) {
        returnArray[zeroValues] = {
          num: objects[0].num,
          position: objects[zeroValues + combinedValues].position,
          value: objects[0].value,
        };
        break;
      }
      let innerZeroValues = 0;
      for (
        let innerLoopPostion = outerLoopPostion - 1;
        innerLoopPostion >= 0;
        innerLoopPostion--
      ) {
        if (objects[innerLoopPostion].value === 0 && innerLoopPostion !== 0) {
          innerZeroValues++;

          continue;
        }
        if (
          objects[innerLoopPostion].value !== objects[outerLoopPostion].value
        ) {
          returnArray[outerLoopPostion + zeroValues] = {
            num: objects[outerLoopPostion].num,
            position:
              objects[outerLoopPostion + zeroValues + combinedValues].position,
            value: objects[outerLoopPostion].value,
          };
          continue outerLoop;
        }
        if (
          objects[innerLoopPostion].value === objects[outerLoopPostion].value
        ) {
          returnArray[outerLoopPostion + zeroValues] = {
            num: objects[outerLoopPostion].num,
            position:
              objects[outerLoopPostion + zeroValues + combinedValues].position,
            value: objects[outerLoopPostion].value * 2,
          };
          returnArray[outerLoopPostion + zeroValues - 1] = {
            num: objects[innerLoopPostion].num,
            position:
              objects[outerLoopPostion + zeroValues + combinedValues].position,
            value: objects[innerLoopPostion].value,
          };
          if (!noScore) {
            setScore((prev) => prev + objects[outerLoopPostion].value * 2);
            setCurrentRoundScore(
              (prev) => prev + objects[outerLoopPostion].value * 2
            );
          }

          combinedValues++;
          zeroValues = zeroValues + innerZeroValues;

          outerLoopPostion = innerLoopPostion;

          continue outerLoop;
        }
      }
    }

    return returnArray;
  }

  function completeObjects(objects, order) {
    // need to updated function to get the right positions could be a b column d column etc

    // Map the existing objects by their position
    let objectMap = {};
    for (let obj of objects) {
      objectMap[obj.position] = obj;
    }

    // Complete the objects
    let completedObjects = [];
    for (let position of order) {
      if (position in objectMap) {
        completedObjects.push(objectMap[position]);
      } else {
        completedObjects.push({
          value: 0,
          position: position,
          num: null,
        });
      }
    }

    return completedObjects;
  }

  function resetObject(downState, object, orderArray) {
    let nums = [object[0].num, object[1].num, object[2].num, object[3].num];
    let totalCombined = 0;
    let resetObject = Array(4);

    for (let i = 3; i >= 0; i--) {
      if (downState[i] === undefined) {
        break;
      }
      if (i === 0) {
        resetObject[i + totalCombined] = {
          num: downState[i].num,
          position: orderArray[i + totalCombined],
          value: downState[i].value,
        };

        nums.splice(0, 1);
        break;
      }

      if (downState[i - 1] === undefined) {
        if (totalCombined === 0) {
          resetObject[i] = downState[i];

          nums.splice(
            nums.findIndex((x) => x === downState[i].num),
            1
          );
          break;
        }
        if (totalCombined === 1) {
          resetObject[i + totalCombined] = downState[i];
          nums.splice(
            nums.findIndex((x) => x === downState[i].num),
            1
          );
        }

        break;
      }

      if (downState[i].position === downState[i - 1].position) {
        resetObject[i + totalCombined] = downState[i];
        resetObject[totalCombined] = {
          num: downState[i - 1].num,
          position: orderArray[totalCombined],
          value: 0,
        };

        nums.splice(
          nums.findIndex((x) => x === downState[i].num),
          1
        );

        nums.splice(
          nums.findIndex((x) => x === downState[i - 1].num),
          1
        );

        i--;
        totalCombined++;
        continue;
      }
      resetObject[i + totalCombined] = {
        num: downState[i].num,
        position: orderArray[i + totalCombined],
        value: downState[i].value,
      };

      nums.splice(
        nums.findIndex((x) => x === downState[i - totalCombined].num),
        1
      );
    }

    for (let i = 0; i <= nums.length - 1; i++) {
      resetObject[totalCombined + i] = {
        num: nums[i],
        position: orderArray[totalCombined + i],
        value: 0,
      };
    }

    return resetObject;
  }

  function resetBoard(downState, boardState, reverse, direction) {
    let postionOrder =
      direction === "column"
        ? [
            ["a1", "b1", "c1", "d1"],
            ["a2", "b2", "c2", "d2"],
            ["a3", "b3", "c3", "d3"],
            ["a4", "b4", "c4", "d4"],
          ]
        : [
            ["a1", "a2", "a3", "a4"],
            ["b1", "b2", "b3", "b4"],
            ["c1", "c2", "c3", "c4"],
            ["d1", "d2", "d3", "d4"],
          ];

    let resetState = [
      resetObject(
        downState[0],
        boardState[0],
        reverse ? postionOrder[0].reverse() : postionOrder[0]
      ),
      resetObject(
        downState[1],
        boardState[1],
        reverse ? postionOrder[1].reverse() : postionOrder[1]
      ),
      resetObject(
        downState[2],
        boardState[2],
        reverse ? postionOrder[2].reverse() : postionOrder[2]
      ),
      resetObject(
        downState[3],
        boardState[3],
        reverse ? postionOrder[3].reverse() : postionOrder[3]
      ),
    ];

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(resetState);
      }, 200);
    });
  }

  function getBoardState(direction, reverse) {
    let columns = [[], [], [], []];

    let completeArray =
      direction === "column"
        ? [
            ["a1", "b1", "c1", "d1"],
            ["a2", "b2", "c2", "d2"],
            ["a3", "b3", "c3", "d3"],
            ["a4", "b4", "c4", "d4"],
          ]
        : [
            ["a1", "a2", "a3", "a4"],
            ["b1", "b2", "b3", "b4"],
            ["c1", "c2", "c3", "c4"],
            ["d1", "d2", "d3", "d4"],
          ];

    for (let key in layout) {
      if (layout[key].position.includes(direction === "column" ? "1" : "a")) {
        columns[0].push({ ...layout[key], num: key });
      }
      if (layout[key].position.includes(direction === "column" ? "2" : "b")) {
        columns[1].push({ ...layout[key], num: key });
      }
      if (layout[key].position.includes(direction === "column" ? "3" : "c")) {
        columns[2].push({ ...layout[key], num: key });
      }
      if (layout[key].position.includes(direction === "column" ? "4" : "d")) {
        columns[3].push({ ...layout[key], num: key });
      }
    }

    return [
      reverse
        ? completeObjects(columns[0], completeArray[0]).reverse()
        : completeObjects(columns[0], completeArray[0]),
      reverse
        ? completeObjects(columns[1], completeArray[1]).reverse()
        : completeObjects(columns[1], completeArray[1]),
      reverse
        ? completeObjects(columns[2], completeArray[2]).reverse()
        : completeObjects(columns[2], completeArray[2]),
      reverse
        ? completeObjects(columns[3], completeArray[3]).reverse()
        : completeObjects(columns[3], completeArray[3]),
    ];
  }

  function combineColumns(columns, noScore) {
    let completedColumns = [
      combineObjects(columns[0], noScore),
      combineObjects(columns[1], noScore),
      combineObjects(columns[2], noScore),
      combineObjects(columns[3], noScore),
    ];

    return completedColumns;
  }

  function updateLayout(updatedTiles) {
    let newLayout = { ...layout };

    // Iterate over newResults and update newLayout
    updatedTiles.flat().forEach((item) => {
      if (item !== null) {
        newLayout[item.num] = {
          value: item.value,
          position: item.position,
        };
      }
    });

    setLayout(newLayout);
  }

  function possibleMove(newMove) {
    let flatNewState = newMove.flat().filter((item) => item !== null);

    for (let index = 0; index < flatNewState.length; index++) {
      if (
        layout[flatNewState[index].num].position !==
          flatNewState[index].position ||
        layout[flatNewState[index].num].value !== flatNewState[index].value
      ) {
        return true;
      }
    }

    return false;
  }

  function checkForGameOver() {
    let upColumns = getBoardState("column", true);
    let upState = combineColumns(upColumns, true);
    if (possibleMove(upState)) {
      return;
    }

    let downColumns = getBoardState("column");
    let downState = combineColumns(downColumns, true);
    if (possibleMove(downState)) {
      return;
    }

    let leftRows = getBoardState("rows", true);
    let leftState = combineColumns(leftRows, true);
    if (possibleMove(leftState)) {
      return;
    }

    let rightRows = getBoardState("rows");
    let rightState = combineColumns(rightRows, true);
    if (possibleMove(rightState)) {
      return;
    }

    setGameOver(true);
  }

  function updateRandomZeroValue(arr) {
    // Flatten the array and filter out objects with value 0
    let zeroValueObjects = arr.flat().filter((item) => item.value === 0);

    // If there are no objects with value 0, return the original array
    if (zeroValueObjects.length === 0) {
      checkForGameOver();
      return arr;
    }

    // Select a random object with value 0
    let randomObject =
      zeroValueObjects[Math.floor(Math.random() * zeroValueObjects.length)];

    // Update the value of the random object to 2 in the original array
    for (let subArr of arr) {
      for (let item of subArr) {
        if (item && item.num === randomObject.num) {
          item.value = Math.random() < 0.9 ? 2 : 4;

          return arr; // Return the updated array
        }
      }
    }
  }

  async function moveDirection(direction) {
    let getColumn = direction === "Up" || direction === "Down";
    let reverse = direction === "Up" || direction === "Left";
    setInProcess(true);
    let currentBoard = getBoardState(getColumn ? "column" : "row", reverse);

    let moveState = combineColumns(currentBoard);

    if (!possibleMove(moveState)) {
      setInProcess(false);
      return;
    }

    setAnimation(true);
    updateLayout(moveState);

    let reset = await resetBoard(
      moveState,
      currentBoard,
      reverse && reverse,
      getColumn ? "column" : "row"
    );

    setAnimation(false);

    let updatedArray = updateRandomZeroValue(reset);

    updateLayout(updatedArray);
    setInProcess(false);
    setCurrentRoundScore(0);
  }

  async function checkKey(e) {
    e = e || window.event;

    if (!inProcess && !gameOver) {
      if (e.keyCode == "38") {
        moveDirection("Up");
      } else if (e.keyCode == "37") {
        moveDirection("Left");
      } else if (e.keyCode == "39") {
        moveDirection("Right");
      } else if (e.keyCode == "40") {
        moveDirection("Down");
      }
    }
  }

  const handlers = useSwipeable({
    onSwiped: (eventData) => moveDirection(eventData.dir),
  });

  return (
    <div>
      <div className="header">
        <div className="about">
          <h1>2048 Clone</h1>
          <p>
            Created by: <a href="https://www.davidwaitedev.com/">David Waite</a>
          </p>
          <p></p>
          <a href="https://play2048.co/" target="_blank" rel="noreferrer">
            Original
          </a>
        </div>

        <div className="scoreContainer">
          <div>
            <h3>SCORE</h3>
            {currentRoundScore !== 0 && (
              <p className="addedScore">+{currentRoundScore}</p>
            )}
            <p>{score}</p>
          </div>
          <div>
            <h3>BEST</h3>
            <p>{bestScore}</p>
          </div>
        </div>
      </div>

      <div className="container" {...handlers}>
        {gameOver && (
          <div className="gameOver">
            <h2 className="heading">Game Over</h2>
            <button onClick={() => setGameOver(false)}>Play again</button>
          </div>
        )}

        <div className="boxContainer">
          <Tile
            number={layout.num1.value}
            position={layout.num1.position}
            animation={animation}
          />
          <Tile
            number={layout.num2.value}
            position={layout.num2.position}
            animation={animation}
          />
          <Tile
            number={layout.num3.value}
            position={layout.num3.position}
            animation={animation}
          />
          <Tile
            number={layout.num4.value}
            position={layout.num4.position}
            animation={animation}
          />
          <Tile
            number={layout.num5.value}
            position={layout.num5.position}
            animation={animation}
          />
          <Tile
            number={layout.num6.value}
            position={layout.num6.position}
            animation={animation}
          />
          <Tile
            number={layout.num7.value}
            position={layout.num7.position}
            animation={animation}
          />
          <Tile
            number={layout.num8.value}
            position={layout.num8.position}
            animation={animation}
          />
          <Tile
            number={layout.num9.value}
            position={layout.num9.position}
            animation={animation}
          />
          <Tile
            number={layout.num10.value}
            position={layout.num10.position}
            animation={animation}
          />
          <Tile
            number={layout.num11.value}
            position={layout.num11.position}
            animation={animation}
          />
          <Tile
            number={layout.num12.value}
            position={layout.num12.position}
            animation={animation}
          />
          <Tile
            number={layout.num13.value}
            position={layout.num13.position}
            animation={animation}
          />
          <Tile
            number={layout.num14.value}
            position={layout.num14.position}
            animation={animation}
          />
          <Tile
            number={layout.num15.value}
            position={layout.num15.position}
            animation={animation}
          />
          <Tile
            number={layout.num16.value}
            position={layout.num16.position}
            animation={animation}
          />
        </div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
        <div className="boxContainer"></div>
      </div>
    </div>
  );
}

export default App;
