import {create }from 'zustand';

const useStore = create((set) => ({
  ip: '',
  blocks: {}, 
  setIp: (ip) => set({ ip }),
  addBlock: (id, json) => set((state) => ({ 
    blocks: { ...state.blocks, [id]: json}
  })),
  removeBlock: (id) => set((state) => {
    // Create a new object excluding the block with the given id
    const newBlocks = Object.keys(state.blocks).reduce((acc, currentId) => {
      if (currentId !== id) {
        acc[currentId] = state.blocks[currentId];
      }
      return acc;
    }, {});

    // Update the state with the new blocks object
    return { blocks: newBlocks };
  }),
}));

export default useStore;
