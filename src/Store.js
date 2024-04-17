import {create }from 'zustand';
import { parseUrdfForJoints, parseUrdfForLinks } from './urdfParser.js';
import { Timer } from './Timer.js';
import { eulerToQuaternion, interpolateScalar, quaternionFromEuler, quaternionToEuler } from './utils.js';
import { JointLookup } from './Misty-Robot/JointLookup.js';
import { MISTY_ARM_LENGTH, PI, MAX_ARM_SPEED } from './Constants.js';
import { starting_tfs, starting_items } from './Misty_Load_File.js';
import { Quaternion } from "three";
 
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
  clock: new Timer(),
  tfs:{...starting_tfs},
  startingTfs: JSON.parse(JSON.stringify(starting_tfs)), // Used to start the animation from the center everytime
  endingTfs: JSON.parse(JSON.stringify(starting_tfs)), 
  items:{...starting_items},
  loadFromURDF: (urdfFile) => set({
    tfs: {...parseUrdfForJoints(urdfFile)},
    items: {...parseUrdfForLinks(urdfFile)}
  }),
  setIp: (ip) => set({ ip }),
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
 
    // Update the state with the new blocks object
    return { Start: newBlocks };
  }),
  getBlocksByType: (type) => {
    const blocks = get().blocks;
    return Object.values(blocks).filter(block => block.type === type)[0];
  },
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
  animateHead: (roll, pitch, yaw) => {

  },
  animateBothArms: (lPosition, lVelocity, rPosition, rVelocity) => {
    const allTfs = JSON.parse(JSON.stringify(get().endingTfs));
    let lEndArmTf = JSON.parse(JSON.stringify(allTfs[JointLookup("Left")]));
    let lArmTf = JSON.parse(JSON.stringify(allTfs[JointLookup("Left")]));
    let rEndArmTf = JSON.parse(JSON.stringify(allTfs[JointLookup("Right")]));
    let rArmTf = JSON.parse(JSON.stringify(allTfs[JointLookup("Right")]));

    let lEuler = quaternionToEuler(lArmTf.rotation);
    let distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(lEuler.y - lPosition);
    const lTime = distance / ((lVelocity / 100) * MAX_ARM_SPEED);

    let rEuler = quaternionToEuler(lArmTf.rotation);
    distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(rEuler.y - rPosition);
    const rTime = distance / ((rVelocity / 100) * MAX_ARM_SPEED);
    
    let temp = {x: 0, y: lPosition, z: 0};
    const lNewQuat = eulerToQuaternion(temp.x, temp.y, temp.z);

    temp = {x: 0, y: rPosition, z: 0};
    const rNewQuat = eulerToQuaternion(temp.x, temp.y, temp.z);

    let lTimeVector = [0];
    let lwVector = [];
    let lxVector = [];
    let lyVector = [];
    let lzVector = [];
    let rTimeVector = [0];
    let rwVector = [];
    let rxVector = [];
    let ryVector = [];
    let rzVector = [];
    if (lArmTf.rotation.w) {
      lwVector.push(lArmTf.rotation.w);
      lxVector.push(lArmTf.rotation.x);
      lyVector.push(lArmTf.rotation.y);
      lzVector.push(lArmTf.rotation.z);
    } else {
      const start = JSON.parse(JSON.stringify(get().startingTfs));
      const tempRot = JSON.parse(JSON.stringify(start[JointLookup("Left")]));
      lwVector.push(tempRot.rotation.w);
      lxVector.push(tempRot.rotation.x);
      lyVector.push(tempRot.rotation.y);
      lzVector.push(tempRot.rotation.z);
    }
    
    if (rArmTf.rotation.w) {
      rwVector.push(rArmTf.rotation.w);
      rxVector.push(rArmTf.rotation.x);
      ryVector.push(rArmTf.rotation.y);
      rzVector.push(rArmTf.rotation.z);
    } else {
      const start = JSON.parse(JSON.stringify(get().startingTfs));
      const tempRot = JSON.parse(JSON.stringify(start[JointLookup("Right")]));
      rwVector.push(tempRot.rotation.w);
      rxVector.push(tempRot.rotation.x);
      ryVector.push(tempRot.rotation.y);
      rzVector.push(tempRot.rotation.z);
    }

    const maxTime = 600;
    for (let i=10; i <= maxTime; i+=10) {
      lTimeVector.push(lTime*i);
      rTimeVector.push(rTime*i);
      let lq = new Quaternion(lxVector[0], lyVector[0], lzVector[0], lwVector[0]);
      lq.slerp(lNewQuat, i/maxTime);
      lwVector.push(lq._w);
      lxVector.push(lq._x);
      lyVector.push(lq._y);
      lzVector.push(lq._z);
      let rq = new Quaternion(rxVector[0], ryVector[0], rzVector[0], rwVector[0]);
      rq.slerp(rNewQuat, i/maxTime);
      rwVector.push(rq._w);
      rxVector.push(rq._x);
      ryVector.push(rq._y);
      rzVector.push(rq._z);
    }
    
    // Hold at final position until next action
    lTimeVector.push(Infinity);
    rTimeVector.push(Infinity);
    lwVector.push(lNewQuat._w);
    lxVector.push(lNewQuat._x);
    lyVector.push(lNewQuat._y);
    lzVector.push(lNewQuat._z);
    rwVector.push(rNewQuat._w);
    rxVector.push(rNewQuat._x);
    ryVector.push(rNewQuat._y);
    rzVector.push(rNewQuat._z);

    lEndArmTf.rotation.w = lNewQuat._w;
    lEndArmTf.rotation.x = lNewQuat._x;
    lEndArmTf.rotation.y = lNewQuat._y;
    lEndArmTf.rotation.z = lNewQuat._z;
    rEndArmTf.rotation.w = rNewQuat._w;
    rEndArmTf.rotation.x = rNewQuat._x;
    rEndArmTf.rotation.y = rNewQuat._y;
    rEndArmTf.rotation.z = rNewQuat._z;
    
    lArmTf.rotation.w = interpolateScalar(lTimeVector, lwVector);
    lArmTf.rotation.x = interpolateScalar(lTimeVector, lxVector);
    lArmTf.rotation.y = interpolateScalar(lTimeVector, lyVector);
    lArmTf.rotation.z = interpolateScalar(lTimeVector, lzVector);
    rArmTf.rotation.w = interpolateScalar(rTimeVector, rwVector);
    rArmTf.rotation.x = interpolateScalar(rTimeVector, rxVector);
    rArmTf.rotation.y = interpolateScalar(rTimeVector, ryVector);
    rArmTf.rotation.z = interpolateScalar(rTimeVector, rzVector);

    let result = {};
    result[JointLookup("Left")] = {...lArmTf};
    result[JointLookup("Right")] = {...rArmTf};
    let endResult = {};
    endResult[JointLookup("Left")] = {...lEndArmTf};
    endResult[JointLookup("Right")] = {...rEndArmTf};

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
  },
  animateArm: (arm, position, velocity) => {
    const allTfs = JSON.parse(JSON.stringify(get().endingTfs));
    let endArmTf = JSON.parse(JSON.stringify(allTfs[JointLookup(arm)]));
    let armTf = JSON.parse(JSON.stringify(allTfs[JointLookup(arm)]));
    console.log(JSON.stringify(endArmTf));
    console.log(JSON.stringify(armTf));

    let euler = quaternionToEuler(armTf.rotation);
    const distance = 2 * PI * MISTY_ARM_LENGTH * Math.abs(euler.y - position);
    const time = distance / ((velocity / 100) * MAX_ARM_SPEED);
    
    let temp = {x: 0, y: 0, z: position};
    // const newQuat = eulerToQuaternion(temp.x, temp.y, temp.z);
    let newQuatArray = quaternionFromEuler([temp.x, temp.y, temp.z]);
    const newQuat = new Quaternion(newQuatArray[1], newQuatArray[2], newQuatArray[3], newQuatArray[0])

    let timeVector = [0];
    let wVector = [];
    let xVector = [];
    let yVector = [];
    let zVector = [];
    if (armTf.rotation.w) {
      wVector.push(armTf.rotation.w);
      xVector.push(armTf.rotation.x);
      yVector.push(armTf.rotation.y);
      zVector.push(armTf.rotation.z);
    } else {
      const start = JSON.parse(JSON.stringify(get().startingTfs));
      const tempRot = JSON.parse(JSON.stringify(start[JointLookup(arm)]));
      wVector.push(tempRot.rotation.w);
      xVector.push(tempRot.rotation.x);
      yVector.push(tempRot.rotation.y);
      zVector.push(tempRot.rotation.z);
    }

    const maxTime = 600;
    for (let i=10; i <= maxTime; i+=10) {
      timeVector.push(time*i);
      let q = new Quaternion(xVector[0], yVector[0], zVector[0], wVector[0]);
      q.slerp(newQuat, i/maxTime);
      wVector.push(q._w);
      xVector.push(q._x);
      yVector.push(q._y);
      zVector.push(q._z);
    }
    
    // Hold at final position until next action
    timeVector.push(Infinity);
    wVector.push(newQuat._w);
    xVector.push(newQuat._x);
    yVector.push(newQuat._y);
    zVector.push(newQuat._z);

    endArmTf.rotation.w = newQuat._w;
    endArmTf.rotation.x = newQuat._x;
    endArmTf.rotation.y = newQuat._y;
    endArmTf.rotation.z = newQuat._z;
    
    armTf.rotation.w = interpolateScalar(timeVector, wVector);
    armTf.rotation.x = interpolateScalar(timeVector, xVector);
    armTf.rotation.y = interpolateScalar(timeVector, yVector);
    armTf.rotation.z = interpolateScalar(timeVector, zVector);

    let result = {};
    result[JointLookup(arm)] = {...armTf};
    let endResult = {};
    endResult[JointLookup(arm)] = {...endArmTf};

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