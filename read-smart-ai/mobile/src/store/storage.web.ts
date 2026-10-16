import { createJSONStorage, type StateStorage } from 'zustand/middleware';

// expo-sqlite's WebAssembly VFS can become invalid during web HMR/SSR. The
// browser already provides durable key-value storage, so use it directly.
const webStorage: StateStorage = {
  getItem: (name) => (typeof window === 'undefined' ? null : window.localStorage.getItem(name)),
  setItem: (name, value) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window !== 'undefined') window.localStorage.removeItem(name);
  },
};

export const persistStorage = createJSONStorage(() => webStorage);
