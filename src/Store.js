import {create }from 'zustand';
import { parseUrdfForJoints, parseUrdfForLinks } from './urdfParser.js';
import { Timer } from './Timer.js';
import { determineZAngleFromQuaternion, eulerToQuaternion, interpolateScalar, quaternionToEuler } from './utils.js';
import { JointLookup } from './Misty-Robot/JointLookup.js';
import { MISTY_ARM_LENGTH, PI, MAX_ARM_SPEED, ARM_OFFSET_ANGLE, MAX_DIST_PER_SEC, MAX_ANGLE_PER_SEC, SIM_TIME } from './Constants.js';
import { starting_tfs, starting_items } from './Misty_Load_File.js';
import { Quaternion, Vector3 } from "three";
import * as Blockly from "blockly";
import goalPrompt from './prompts/goal_prompt.js';
import dummyData from './tracker_components/dummy_data.json';
import blockPrompt from './prompts/block_prompt.js';
import { pickBy } from 'lodash';
import { blockTypes } from './blocks/text.js';

const useStore = create((set,get) => ({
  ip: '',
  blocks: {}, 
  Start:{},
  lines:{},
  hulls:{},
  texts:{},
  points:{},
  widgets:{},
  counter: 0,
  blocklyWorkspaceXML:{},
  lightMode: true,
  simOnly: false,
  isConnected: false,
  workerThread: null,
  blocklyWorkspace: null,
  llmEndpoint: "",
  llmAPIKey: "",
  llmDeployment: "",
  userPrompt: "",
  programGoals: {...dummyData},
  llmProcessing: false,
  llmMode: true,
  showGPTConsole:false,
  fullScreenPanel: false,
  displayLLMBlockPrompt: false,
  mistyAudioList: [],
  mistyImageList: [],
  headerHeight: 0,
  headerWidth: 0,
  clock: new Timer(),
  tfs:{...starting_tfs},
  startingTfs: JSON.parse(JSON.stringify(starting_tfs)), // Used to start the animation from the center everytime
  endingTfs: JSON.parse(JSON.stringify(starting_tfs)), 
  items:{...starting_items},
  activeModal: null,
  setActiveModal: (modal) => set(_ => ({ activeModal: modal })),
  closeModal: () => set(_ => ({ activeModal: null })),
  toggleLLMMode: (toggle) => set({
    llmMode: toggle
  }),
  setFullScreenPanel:(state) => set({
    fullScreenPanel: state
  }),
  setShowGPTConsole:(state) => set({
    showGPTConsole: state
  }),
  toggleLLMBlockPrompt: (toggle) => set({
    displayLLMBlockPrompt: toggle
  }),
  toggleTheme: (toggle) => set({
    lightMode: toggle
  }),
  getAllTasks: () => {
    return get().programGoals;
  },
  getMainTasks: () => {
    let data = get().programGoals;
    return Object.keys(data)
      .filter(key => data[key].type === "task")
      .sort((keyA, keyB) => data[keyA].order - data[keyB].order)
      .reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
  },
  setWorkerThread: (worker) => set({
    workerThread: worker
  }),
  setBlocklyWorkspace: (ws) => set({
    blocklyWorkspace: ws
  }),
  setAPIKey: (key) => set({
    llmAPIKey: key
  }),
  setEndpoint: (endpoint) => set({
    llmEndpoint: endpoint
  }),
  setDeployment: (deployment) => set({
    llmDeployment: deployment
  }),
  setImageList: (list) => set({
    mistyImageList: list
  }),
  setAudioList: (list) => set({
    mistyAudioList: list
  }),
  setUserPrompt: (userPrompt) => set({
    userPrompt
  }),
  setHeaderDimensions: (height, width) => set({
    headerHeight: height,
    headerWidth: width
  }),
  generateProgramOutline: () => {
    set({
      llmProcessing: true
    });
    let storeData = get();
    let userPrompt = storeData.userPrompt;
    let llmEndpoint = storeData.llmEndpoint;
    let llmDeployment = storeData.llmDeployment;
    let llmAPIKey = storeData.llmAPIKey;
    // fetch("https://httpbin.org/delay/10")
    fetch(llmEndpoint + "/openai/deployments/" + llmDeployment + "/chat/completions?api-version=2024-02-01", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": llmAPIKey
      },
      body: JSON.stringify({
        messages: [
          {role: "system", content: goalPrompt},
          {role: "user", content: "Give me the output for the following user prompt: \"" + userPrompt + "\""}]
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`LLM Request failed with status ${res.status}`);
      }
      return res.json();
    })
    .then(json => {
      console.log(json);
      let tempGoalString = json["choices"][0].message.content;
      tempGoalString = tempGoalString.length > 0 ? tempGoalString.slice(1, tempGoalString.length - 1) : {};
      set({
        programGoals: JSON.parse(tempGoalString),
        llmProcessing: false,
        activeModal: null
      })
    })
    .catch((error) => {
      set({
        llmProcessing: false
      })
      alert(`Failed to connect to ChatGPT: ${error.message}`);
    });
  },
  generateProgram: () => {
    set({
      llmProcessing: true
    });
    let storeData = get();
    let userPrompt = storeData.userPrompt;
    let llmEndpoint = storeData.llmEndpoint;
    let llmDeployment = storeData.llmDeployment;
    let llmAPIKey = storeData.llmAPIKey;
    // fetch("https://httpbin.org/delay/2")
    fetch(llmEndpoint + "/openai/deployments/" + llmDeployment + "/chat/completions?api-version=2024-02-01", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": llmAPIKey
      },
      body: JSON.stringify({
        messages: [
          {role: "system", content: blockPrompt},
          {role: "user", content: "Give me the output for the following user prompt: \"" + userPrompt + "\""}]
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`LLM Request failed with status ${res.status}`);
      }
      return res.json();
    })
    .then(json => {
      console.log(json);
      let tempGoalString = json["choices"][0].message.content;
      console.log(tempGoalString);
      set({
        llmProcessing: false,
        activeModal: null
      });
      get().loadBlocks(JSON.parse(tempGoalString), get().blocklyWorkspace);
    })
    .catch((error) => {
      set({
        llmProcessing: false
      })
      alert(`Failed to connect to ChatGPT: ${error.message}`);
    });
  },
  clearProgram: () => set({
    blocks: {}
  }),
  clearProgramExceptStart: () => set({
    blocks: pickBy(get().blocks, block => block.type === "Start")
  }),
  loadBlocks: (data, ws) => {
    // Create blocks
    let startBlocks = ws.getBlocksByType("Start");
    if (startBlocks.length > 0) {
      get().clearProgramExceptStart();
    } else {
      get().clearProgram();
    }
    let initialBlock = startBlocks.length > 0 ? startBlocks[0] : null;
    let blockIds = [];
    let blocklyBlockIds = [];
    let nextList = [data["data"][0].id];
    let ignoredBlocks = [];
    for(let i = 0; i < data["data"].length; i++) {
      let type = data["data"][i]["type"];
      if (["face", "audio"].includes(type)) {
        type = data["data"][i]["value"];
      }

      // Ignore non-correct blocks
      if (!["math_number", "colour_picker", "text"].includes(type) && !blockTypes.includes(type)) {
        ignoredBlocks.push(data["data"][i]["id"]);
        continue;
      }

      let t = Blockly.serialization.blocks.append({
        "type": type,
      }, ws);
      if (t.type === "Start") {
        initialBlock = t;
      }

      if (type === "math_number") {
        t.getField("NUM").setValue(data["data"][i]["value"])
      }
      if (type === "colour_picker") {
        t.getField("COLOUR").setValue(data["data"][i]["value"])
      }
      if (type === "text") {
        t.getField("TEXT").setValue(data["data"][i]["value"])
      }
      if (["BasicSlider", "ArmPositionSlider", "SpeedSlider", "TimeSlider", "HeadPitchSlider", "HeadRollSlider", "HeadYawSlider"].includes(type)) {
        t.getField("FIELD_slider_value").setValue(data["data"][i]["value"]);
      }
      
      blockIds.push(data["data"][i]["id"]);
      blocklyBlockIds.push(t.id);
      if (data["data"][i]?.["nextStatement"]) {
        nextList.push(data["data"][i]?.["nextStatement"]);
      }
    }
    
    // Connect blocks to parameters
    for(let i = 0; i < data["data"].length; i++) {
      // Ignore non-correct blocks
      if (ignoredBlocks.includes(data["data"][i]["id"])) {
        continue;
      }
      let currentBlock = ws.getBlockById(blocklyBlockIds[blockIds.indexOf(data["data"][i]["id"])])
      if (currentBlock) {
        Object.keys(data["data"][i]).forEach(key => {
          if (!(key == "id" || key == "value" || key == "type" || key == "nextStatement")) {
            // Don't add parameters if the parameter block was invalid
            const paramBlock = ws.getBlockById(blocklyBlockIds[blockIds.indexOf(data["data"][i][key])]);
            if (paramBlock) {
              currentBlock.getInput(key).connection.connect(paramBlock.outputConnection);
            }
          }
        });
      }
    }
    
    // Connect blocks to parents
    for(let i = 1; i < nextList.length; i++) {
      // Ignore non-correct blocks
      // Will cause a break in code
      if (ignoredBlocks.includes(nextList[i])) {
        continue;
      }
      let currentBlock = ws.getBlockById(blocklyBlockIds[blockIds.indexOf(nextList[i])]);
      let parentBlock = ws.getBlockById(blocklyBlockIds[blockIds.indexOf(nextList[i-1])]);
      if (currentBlock) {
        parentBlock?.nextConnection.connect(currentBlock.previousConnection);
      }
    }

    let currentBlock = ws.getBlockById(blocklyBlockIds[blockIds.indexOf(nextList[0])]);
    initialBlock.nextConnection.connect(currentBlock.previousConnection);
  },
  setIsConnected: (isConnected) => set({ isConnected: isConnected}),
  loadFromURDF: (urdfFile) => set({
    tfs: {...parseUrdfForJoints(urdfFile)},
    items: {...parseUrdfForLinks(urdfFile)}
  }),
  setIp: (ip) => set({ ip }),
  disconnect: () => set({
    ip: '',
    isConnected: false,
    mistyAudioList: [],
    mistyImageList: []
  }),
  addBlock: (id, json) => set((state) => ({ 
    blocks: { ...state.blocks, [id]: json}
  })),
  removeBlock: (ids) => set((state) => {
    // Create a new object excluding the block with the given id
    const newBlocks = Object.keys(state.blocks).reduce((acc, currentId) => {
      if (!ids.includes(currentId)) {
        acc[currentId] = state.blocks[currentId];
      }
      return acc;
    }, {});
 
    // Update the state with the new blocks object
    return { blocks: newBlocks };
  }),

  updateBlock: (id, updatedJson) => set((state) => ({
    blocks: { ...state.blocks, [id]: updatedJson  }
  })),
  getBlock: (id) => get().blocks[id],
  getBlocks:()=>get().blocks,

  addBlocktoStart: (id, json) => set((state) => ({ 
    Start: { ...state.Start, [id]: json}
  })),

  removeBlockfromStart: (id) => set((state) => {
    // Create a new object excluding the block with the given id
    const newBlocks = Object.keys(state.Start).reduce((acc, currentId) => {
      if (currentId !== id) {
        acc[currentId] = state.Start[currentId];
      }
      return acc;
    }, {});
    return { Start: newBlocks };
  }),
  getBlocksByType: (type) => {
    const blocks = get().blocks;
    return Object.values(blocks).filter(block => block.type === type)[0];
  },
  getBlockType:(id)=>{
    const blocks = get().blocks;
        return blocks[id]?.type || "Unknown block type"; },
  setWorkspaceXml:(xml)=>set({ blocklyWorkspaceXML: xml }),
  getWorkspaceXml:()=>get().blocklyWorkspaceXML,
  onPointerMissed: () => console.log("Missed Click"),
  onPointerOver: () => {},
  onPointerOut: () => {},
  resetSim: () => {
    const allTfs = JSON.parse(JSON.stringify(get().startingTfs));
    set({
      tfs: {
        ...allTfs
      },
      endingTfs: {
        ...allTfs,
      }
    })
  },
  toggleSimOnly: (value) => {
    set({
      simOnly: value
    })
  },
  setAnimationFrames: (newTfs, newEndingTfs) => {
    set({
      tfs: {...newTfs},
      endingTfs: {...newEndingTfs}
    })
  },
  animateDrive: (linearVelocity, angularVelocity, degree, time) => {
    // todo, rotate by time, should be able to slerp.
    const allTfs = JSON.parse(JSON.stringify(get().endingTfs));
    let endBaseTf = JSON.parse(JSON.stringify(allTfs[JointLookup("Base")]));
    let baseTf = JSON.parse(JSON.stringify(allTfs[JointLookup("Base")]));

    const angle = (angularVelocity/100 * MAX_ANGLE_PER_SEC) * time/1000;
    const distance = linearVelocity/100 * MAX_DIST_PER_SEC * time/1000;
    const r = angle !== 0 ? distance/angle : distance;

    let newQuat = new Quaternion(baseTf.rotation.x, baseTf.rotation.y, baseTf.rotation.z, baseTf.rotation.w);
    const currentEulerZ = determineZAngleFromQuaternion(newQuat);
    console.log(currentEulerZ);
    if (angle !== 0) {
      let temp = {x: 0, y: 0, z: angle};
      newQuat = eulerToQuaternion(temp.x, temp.y, temp.z);
      newQuat.multiply(new Quaternion(baseTf.rotation.x, baseTf.rotation.y, baseTf.rotation.z, baseTf.rotation.w));
    }

    let timeVector = [0];
    let xVector = [baseTf.position.x];
    let yVector = [baseTf.position.y];
    let zVector = [baseTf.position.z];
    
    let qWVector = [baseTf.rotation.w];
    let qXVector = [baseTf.rotation.x];
    let qYVector = [baseTf.rotation.y];
    let qZVector = [baseTf.rotation.z];

    const maxTime = SIM_TIME;
    
    // offset to circle center
    let aX = baseTf.position.x;
    let aY = baseTf.position.y;
    if (angle > 0) {
      aX = r;
    } else if (angle < 0) {
      aX -= r;
    }

    console.log(angle);
    let newPosition = null;
    for (let i=10; i <= maxTime; i=10) {
      timeVector.push(time/1000*i);
      let tAngle = angle * i/maxTime;
      let tDist = distance * i/maxTime;
      if (angle !== 0) {
        newPosition = new Vector3(aX  (Math.cos(currentEulerZ) * tDist / tAngle * Math.cos(tDist)), aY  (Math.sin(currentEulerZ) * tDist / tAngle * Math.sin(tDist)), zVector[0]);
      } else {
        newPosition = new Vector3(aX  (Math.cos(currentEulerZ) * tDist), aY  (Math.sin(currentEulerZ) * tDist), zVector[0]);
      }
      
      xVector.push(newPosition.x);
      yVector.push(newPosition.y);
      zVector.push(newPosition.z);

      let q = new Quaternion(qXVector[0], qYVector[0], qZVector[0], qWVector[0]);
      q.slerp(newQuat, i/maxTime);

      qWVector.push(q._w);
      qXVector.push(q._x);
      qYVector.push(q._y);
      qZVector.push(q._z);
    }
    
    timeVector.push(Infinity);
    xVector.push(newPosition.x);
    yVector.push(newPosition.y);
    zVector.push(newPosition.z);
    qWVector.push(newQuat._w);
    qXVector.push(newQuat._x);
    qYVector.push(newQuat._y);
    qZVector.push(newQuat._z);

    endBaseTf.position.x = newPosition.x;
    endBaseTf.position.y = newPosition.y;
    endBaseTf.position.z = newPosition.z;

    endBaseTf.rotation.w = newQuat._w;
    endBaseTf.rotation.x = newQuat._x;
    endBaseTf.rotation.y = newQuat._y;
    endBaseTf.rotation.z = newQuat._z;
    
    baseTf.position.x = interpolateScalar(timeVector, xVector);
    baseTf.position.y = interpolateScalar(timeVector, yVector);
    baseTf.position.z = interpolateScalar(timeVector, zVector);
    
    baseTf.rotation.w = interpolateScalar(timeVector, qWVector);
    baseTf.rotation.x = interpolateScalar(timeVector, qXVector);
    baseTf.rotation.y = interpolateScalar(timeVector, qYVector);
    baseTf.rotation.z = interpolateScalar(timeVector, qZVector);

    let result = {};
    result[JointLookup("Base")] = {...baseTf};
    let endResult = {};
    endResult[JointLookup("Base")] = {...endBaseTf};

    set({
      tfs: {
        ...allTfs,
        ...result
      },
      endingTfs: {
        ...allTfs,
        ...endResult
      }
    })
  }
}));

export default useStore;