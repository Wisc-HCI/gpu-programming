import {create }from 'zustand';
 
const useStore = create((set,get) => ({
  ip: '',
  blocks: {}, 
  Start:{},
  shadowBlocks:{},
  setIp: (ip) => set({ ip }),
  addBlock: (id, json) => set((state) => ({ 
    blocks: { ...state.blocks, [id]: json}
  })),
  addShadowBlock:(id, json) => set((state) => ({ 
    shadowBlocks: { ...state.shadowBlocks, [id]: json}
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

  removeShadowBlock: (id) => set((state) => {
    // Create a new object excluding the block with the given id
    const newShadowBlocks = Object.keys(state.shadowBlocks).reduce((acc, currentId) => {
      if (id !== currentId) {
        acc[currentId] = state.blocks[currentId];
      }
      return acc;
    }, {});
    // Update the state with the new blocks object
    return { shadowBlocks: newShadowBlocks };
  }),
  updateBlock: (id, updatedJson) => set((state) => ({
    blocks: { ...state.blocks, [id]: updatedJson  }
  })),
  getBlock: (id) => get().blocks[id],

  
  getShadowBlock: (id) => {
    const shadowBlocks = get().shadowBlocks;
    return get().shadowBlocks[id];
  }, 
  

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
  
}));

export default useStore;