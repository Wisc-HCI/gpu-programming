import {create }from 'zustand';

const useStore = create((set) => ({
  ip: '',
  blocks: {}, 
  setIp: (ip) => set({ ip }),
  addBlock: (id, json) => set((state) => ({ blocks: { ...state.blocks, [id]: json}})),
  
}));

export default useStore;
