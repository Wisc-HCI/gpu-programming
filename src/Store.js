import {create }from 'zustand';
import { parseUrdfForJoints, parseUrdfForLinks } from './urdfParser.js';
import { Timer } from './Timer.js';
import { determineZAngleFromQuaternion, eulerToQuaternion, interpolateScalar, quaternionToEuler } from './utils.js';
import { JointLookup } from './Misty-Robot/JointLookup.js';
import { MISTY_ARM_LENGTH, PI, MAX_ARM_SPEED, ARM_OFFSET_ANGLE, MAX_DIST_PER_SEC, MAX_ANGLE_PER_SEC, SIM_TIME } from './Constants.js';
import { starting_tfs, starting_items } from './Misty_Load_File.js';
import { Quaternion, Vector3 } from "three";
 
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
  lightMode: true,
  runOnRobot: true,
  isConnected: false,
  mistyAudioList: [],
  mistyImageList: [],
  clock: new Timer(),
  tfs:{...starting_tfs},
  startingTfs: JSON.parse(JSON.stringify(starting_tfs)), // Used to start the animation from the center everytime
  endingTfs: JSON.parse(JSON.stringify(starting_tfs)), 
  items:{...starting_items},
  activeModal: null,
  setActiveModal: (modal) => set(_ => ({ activeModal: modal })),
  closeModal: () => set(_ => ({ activeModal: null })),
  toggleTheme: (toggle) => set({
    lightMode: toggle
  }),
  setImageList: (list) => set({
    mistyImageList: list
  }),
  setAudioList: (list) => set({
    mistyAudioList: list
  }),
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
  toggleRunRobot: (value) => {
    set({
      runOnRobot: value
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
      aX += r;
    } else if (angle < 0) {
      aX -= r;
    }

    console.log(angle);
    let newPosition = null;
    for (let i=10; i <= maxTime; i+=10) {
      timeVector.push(time/1000*i);
      let tAngle = angle * i/maxTime;
      let tDist = distance * i/maxTime;
      if (angle !== 0) {
        newPosition = new Vector3(aX + (Math.cos(currentEulerZ) * tDist / tAngle * Math.cos(tDist)), aY + (Math.sin(currentEulerZ) * tDist / tAngle * Math.sin(tDist)), zVector[0]);
      } else {
        newPosition = new Vector3(aX + (Math.cos(currentEulerZ) * tDist), aY + (Math.sin(currentEulerZ) * tDist), zVector[0]);
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