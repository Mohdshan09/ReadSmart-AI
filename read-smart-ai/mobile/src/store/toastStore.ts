import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';
export type ToastItem = { id: string; type: ToastType; message: string };

type ToastState = {
  toasts: ToastItem[];
  show: (type: ToastType, message: string, durationMs?: number) => void;
  dismiss: (id: string) => void;
};

let counter = 0;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (type, message, durationMs) => {
    const id = `t${++counter}`;
    // Errors linger a little longer so they can actually be read.
    const ms = durationMs ?? (type === 'error' ? 4500 : 2600);
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }));
    setTimeout(() => get().dismiss(id), ms);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

// react-hot-toast-style API, callable from anywhere (services, stores, screens)
// without a hook. The message IS the meaning — pass the specific server/client
// message, never a generic "something went wrong".
export const toast = {
  success: (message: string) => useToastStore.getState().show('success', message),
  error: (message: string) => useToastStore.getState().show('error', message),
  info: (message: string) => useToastStore.getState().show('info', message),
};
