function combineObjects(objects) {
  // console.log(objects);
  // console.log(objects);
  // Extract the values from the objects

  let combinedObjects = Array(4);
  let totalCombined = 0;
  let totalOuter0 = 0;
  let totalInner0 = 0;

  outerLoop: for (let i = 3; i >= 0; i--) {
    console.log(`start outerloop ${i}`);
    console.log(`total combined ${totalCombined}`);
    console.log(`totalouter0 ${totalOuter0}`);
    console.log(`total inner 0 ${totalInner0}`);
    console.log(combinedObjects);
    if (i === 0) {
      console.log(`ending outerloop because 0`);
      console.log(`total combined ${totalCombined}`);
      console.log(`totalouter0 ${totalOuter0}`);
      console.log(`total inner 0 ${totalInner0}`);
      if (objects[i].value !== 0)
        combinedObjects[i + totalOuter0 + totalInner0 + totalCombined] = {
          num: objects[i].num,
          position:
            objects[i + totalOuter0 + totalCombined + totalInner0].position,
          value: objects[i].value,
        };

      continue;
    }
    console.log(objects[i]);
    if (objects[i].value === 0) {
      console.log("found 0");
      totalOuter0++;
      continue;
    }
    for (let index = i - 1; index >= 0; index--) {
      console.log(`looking ${index}`);

      if (index === 0 && objects[0].value === 0) {
        console.log(`total combined ${totalCombined}`);
        console.log(`totalouter0 ${totalOuter0}`);
        console.log(`total inner 0 ${totalInner0}`);
        combinedObjects[i + totalOuter0 + totalInner0] = {
          num: objects[i].num,
          position:
            objects[i + totalOuter0 + totalCombined + totalInner0].position,
          value: objects[i].value,
        };
        break outerLoop;
      }
      if (objects[index].value === 0) {
        totalInner0++;
        continue;
      }
      if (objects[i].value === objects[index].value) {
        console.log(`combinding ${index} and ${i}`);
        combinedObjects[i + totalOuter0] = {
          num: objects[i].num,
          position: objects[i + totalCombined + totalOuter0].position,
          value: objects[i].value * 2,
        };
        combinedObjects[i + totalOuter0 - 1] = {
          num: objects[index].num,
          position: objects[i + totalCombined + totalOuter0].position,
          value: objects[index].value,
        };
        console.log(JSON.stringify(combinedObjects));
        console.log(combinedObjects);
        totalCombined++;
        i = index;
        continue outerLoop;
      }

      if (i === 3) {
        combinedObjects[3] = {
          num: objects[i].num,
          position: objects[i].position,
          value: objects[i].value,
        };
        i = index + 1;
        console.log("yeet");
        continue outerLoop;
      }
      console.log(`total combined ${totalCombined}`);
      console.log(`totalouter0 ${totalOuter0}`);
      console.log(`total inner 0 ${totalInner0}`);
      console.log(index);
      combinedObjects[index + totalOuter0 + totalCombined + totalInner0] = {
        num: objects[i].num,
        position:
          objects[index + totalCombined + totalOuter0 + totalInner0].position,
        value: objects[i].value,
      };
      i = index + 1;
      continue outerLoop;
    }
    console.log("hit end");
    console.log(combinedObjects);
  }

  console.log(`total combined ${totalCombined}`);
  console.log(`totalouter0 ${totalOuter0}`);
  console.log(`total inner 0 ${totalInner0}`);
  return combinedObjects;
}
