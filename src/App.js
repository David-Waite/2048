import "./styles/App.css";
import Tile from "./components/Tile";
import { useEffect, useState } from "react";

function App() {
  const [newGame, setNewGame] = useState(true);
  const [inProcess, setInProcess] = useState(false);
  const [input, setInput] = useState();
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
    let firstNumber, secondNumber;

    do {
      firstNumber = keys[Math.floor(Math.random() * 16)];
      secondNumber = keys[Math.floor(Math.random() * 16)];
    } while (firstNumber === secondNumber);

    // console.log(firstNumber);
    // console.log(secondNumber);

    setLayout((prevState) => ({
      ...prevState,
      [firstNumber]: { value: 2, position: layout[firstNumber].position },
      [secondNumber]: { value: 2, position: layout[secondNumber].position },
    }));
  }, [newGame]);

  document.onkeydown = checkKey;

  function combineObjects(objects) {
    let zeroValues = 0;
    let combinedValues = 0;
    let returnArray = Array(4);

    outerLoop: for (
      let outerLoopPostion = 3;
      outerLoopPostion >= 0;
      outerLoopPostion--
    ) {
      // console.log(`start of outerloop ${outerLoopPostion}`);
      if (objects[outerLoopPostion].value === 0) {
        // console.log(`breaking outer bc value 0`);

        zeroValues++;
        // console.log(`new zeros values of ${zeroValues}`);
        continue;
      }
      if (outerLoopPostion === 0) {
        // console.log(
        //   `breaking outer bc end moving down to ${zeroValues + combinedValues}`
        // );
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
        // console.log(`looking ${innerLoopPostion}`);
        if (objects[innerLoopPostion].value === 0 && innerLoopPostion !== 0) {
          // console.log(`continue inner loop because value 0`);
          innerZeroValues++;
          // console.log(`new innerZeroValue of ${innerZeroValues}`);

          continue;
        }
        if (
          objects[innerLoopPostion].value !== objects[outerLoopPostion].value
        ) {
          // console.log(
          //   `${outerLoopPostion} !== ${innerLoopPostion} moving ${outerLoopPostion} to ${
          //     objects[outerLoopPostion + zeroValues + combinedValues].position
          //   } `
          // );
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
          // console.log(
          //   `${outerLoopPostion} === ${innerLoopPostion} moving ${outerLoopPostion} to ${
          //     objects[outerLoopPostion].position
          //   } with value of ${objects[outerLoopPostion].value * 2}
          //   and moving ${innerLoopPostion} to same with value of ${
          //     objects[outerLoopPostion].value
          //   }`
          // );
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
          combinedValues++;
          zeroValues = zeroValues + innerZeroValues;
          // console.log(
          //   `adding zeroValues ${zeroValues} and inner zeroValues ${innerZeroValues} : ${
          //     zeroValues + innerZeroValues
          //   }`
          // );
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
    // console.log("here");

    let nums = [object[0].num, object[1].num, object[2].num, object[3].num];
    let totalCombined = 0;
    let resetObject = Array(4);

    for (let i = 3; i >= 0; i--) {
      // console.log(`running ${i}`);
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
        // console.log(totalCombined);
        if (totalCombined === 0) {
          resetObject[i] = downState[i];

          // console.log(`removing bc i i 1 === undefined ${downState[i].num}`);
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

        // console.log(`removing bc combining ${downState[i].num}`);
        nums.splice(
          nums.findIndex((x) => x === downState[i].num),
          1
        );
        // console.log(`removing bc combining ${downState[i - 1].num}`);
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
      // console.log(`removing bc moved down not combined ${downState[i].num}`);

      nums.splice(
        nums.findIndex((x) => x === downState[i - totalCombined].num),
        1
      );
    }

    // console.log(resetObject);
    // console.log(nums);
    for (let i = 0; i <= nums.length - 1; i++) {
      resetObject[totalCombined + i] = {
        num: nums[i],
        position: orderArray[totalCombined + i],
        value: 0,
      };
    }

    // console.log(`total combined ${totalCombined}`);
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

  function combineColumns(columns) {
    let completedColumns = [
      combineObjects(columns[0]),
      combineObjects(columns[1]),
      combineObjects(columns[2]),
      combineObjects(columns[3]),
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

  // function addTile() {
  //   let newNumber;

  //   do {
  //     newNumber = keys[Math.floor(Math.random() * 16)];
  //   } while (layout[newNumber].value !== 0);

  //   console.log(newNumber);
  //   console.log(layout[newNumber]);
  //   setLayout((prevState) => ({
  //     ...prevState,
  //     [newNumber]: { value: 2, position: layout[newNumber].position },
  //   }));
  // }

  function possibleMove(newMove) {
    let flatNewState = newMove.flat().filter((item) => item !== null);

    for (let index = 0; index < flatNewState.length; index++) {
      if (
        layout[flatNewState[index].num].position !==
          flatNewState[index].position ||
        layout[flatNewState[index].num].value !== flatNewState[index].value
      ) {
        // console.log("same");
        return true;
      }
    }

    return false;
  }

  function checkForGameOver() {
    let upColumns = getBoardState("column", true);
    let upState = combineColumns(upColumns);
    if (possibleMove(upState)) {
      return;
    }

    let downColumns = getBoardState("column");
    let downState = combineColumns(downColumns);
    if (possibleMove(downState)) {
      return;
    }

    let leftRows = getBoardState("rows", true);
    let leftState = combineColumns(leftRows);
    if (possibleMove(leftState)) {
      return;
    }

    let rightRows = getBoardState("rows");
    let rightState = combineColumns(rightRows);
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
      return arr;
    }

    // Select a random object with value 0
    let randomObject =
      zeroValueObjects[Math.floor(Math.random() * zeroValueObjects.length)];

    // Update the value of the random object to 2 in the original array
    for (let subArr of arr) {
      for (let item of subArr) {
        if (item && item.num === randomObject.num) {
          item.value = 2;

          return arr; // Return the updated array
        }
      }
    }
  }

  async function checkKey(e) {
    e = e || window.event;
    if (!inProcess && !gameOver) {
      console.log(layout);
      if (e.keyCode == "38") {
        setInProcess(true);
        let columns = getBoardState("column", true);
        console.log("columns");
        console.log(columns);

        let upState = combineColumns(columns);

        console.log("newstate");
        console.log(upState);

        if (!possibleMove(upState)) {
          let totalTiles = upState
            .flat()
            .filter((item) => item !== null).length;
          if (totalTiles === 16) {
            checkForGameOver();
          }
          setInProcess(false);
          return;
        }
        setAnimation(true);
        updateLayout(upState);

        let reset = await resetBoard(upState, columns, true, "column");
        setAnimation(false);
        console.log("Reset");
        console.log(reset);
        let updatedArray = updateRandomZeroValue(reset);

        updateLayout(updatedArray);
        setInProcess(false);
      } else if (e.keyCode == "40") {
        setInProcess(true);
        let columns = getBoardState("column");
        console.log("columns");
        console.log(columns);
        let downState = combineColumns(columns);
        if (!possibleMove(downState)) {
          let totalTiles = downState
            .flat()
            .filter((item) => item !== null).length;
          if (totalTiles === 16) {
            checkForGameOver();
          }
          setInProcess(false);
          return;
        }
        console.log("newState");
        console.log(downState);

        setAnimation(true);
        updateLayout(downState);

        let reset = await resetBoard(downState, columns, false, "column");
        setAnimation(false);
        console.log("Reset");

        console.log(reset);
        let updatedArray = updateRandomZeroValue(reset);

        updateLayout(updatedArray);

        setInProcess(false);
      } else if (e.keyCode == "37") {
        setInProcess(true);
        let rows = getBoardState("rows", true);
        console.log("rows");
        console.log(rows);
        let leftState = combineColumns(rows);
        console.log("NewState");
        console.log(leftState);

        if (!possibleMove(leftState)) {
          let totalTiles = leftState
            .flat()
            .filter((item) => item !== null).length;
          if (totalTiles === 16) {
            checkForGameOver();
          }
          setInProcess(false);
          return;
        }
        setAnimation(true);
        updateLayout(leftState);

        let reset = await resetBoard(leftState, rows, true, "rows");
        setAnimation(false);
        console.log("Reset");
        console.log(reset);
        let updatedArray = updateRandomZeroValue(reset);

        updateLayout(updatedArray);

        setInProcess(false);
      } else if (e.keyCode == "39") {
        setInProcess(true);
        let rows = getBoardState("rows");
        console.log("rows");
        console.log(rows);
        let leftState = combineColumns(rows);
        console.log("newState");
        console.log(leftState);
        if (!possibleMove(leftState)) {
          let totalTiles = leftState
            .flat()
            .filter((item) => item !== null).length;
          if (totalTiles === 16) {
            checkForGameOver();
          }
          setInProcess(false);
          return;
        }

        setAnimation(true);
        updateLayout(leftState);

        let reset = await resetBoard(leftState, rows, false, "rows");
        setAnimation(false);
        console.log("Reset");
        console.log(reset);
        let updatedArray = updateRandomZeroValue(reset);

        updateLayout(updatedArray);

        setInProcess(false);
      }
    }
  }

  return (
    <div>
      <div className="container">
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
