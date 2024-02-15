import create from 'zustand';

const useStore = create((set) => ({
  ip: '',
  setIp: (ip) => set({ ip }),
}));

export default useStore;
