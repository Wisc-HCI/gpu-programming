/* eslint-disable no-restricted-globals */
import { compile } from "../src/compile/useCompile";

self.onmessage = function (e) {
  // Receive data from the main thread
  const blocks = e.data;
  const getBlocksByType = (type) => {
    return Object.values(blocks).filter((block) => block.type === type)[0];
  };
  const getBlock = (id) => blocks[id];


  const start = getBlocksByType("Start");
  let currParam = start;
  let num = 1;
  
  while (currParam && currParam.next) {
    num += 1;
    currParam = getBlock(currParam.next);
    console.log(`compiling block number ${num}`);
    compile(currParam, currParam.type);
  }
  var result = `${num} blocks compiled`;

  // Send data back to the main thread
  self.postMessage(result);
};
