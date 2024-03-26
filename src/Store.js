import {create }from 'zustand';
import { parseUrdfForJoints, parseUrdfForLinks } from './urdfParser.js';
import { Timer } from './Timer.js';
 
const useStore = create((set,get) => ({
  ip: '',
  blocks: {}, 
  Start:{},
  lines:{},
  hulls:{},
  texts:{},
  points:{},
  widgets:{},
  clock: new Timer(),
  tfs:{
    world: {
      position: {x: 0, y: 0, z: 0},
      rotation: {w: 1, x: 0, y: 0, z: 0},
      scale: {x: 1, y: 1, z: 1}
    },
    "test": {
      frame: "world",
      position: {x: 1, y: 0, z: 0},
      rotation: {w: 1, x: 0, y: 0, z: 0},
      scale: {x: 1, y: 1, z: 1}
    },
    
    "test1": {
      frame: "world",
      position: {x: 1, y: 1, z: 0},
      rotation: {w: 1, x: 0, y: 0, z: 0},
      scale: {x: 1, y: 1, z: 1}
    }
  },
  items:{},
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
}));

export default useStore;