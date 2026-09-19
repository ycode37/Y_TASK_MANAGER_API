import { create } from "zustand";

let nextId = 1;

export const useToastStore = create((set, get) => ({
  toasts: [],

  push: (message, tone = "ink") => {
    const id = nextId++;
    set({ toasts: [...get().toasts, { id, message, tone }] });
    setTimeout(() => get().dismiss(id), 3200);
  },

  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = {
  success: (message) => useToastStore.getState().push(message, "moss"),
  error: (message) => useToastStore.getState().push(message, "rust"),
  info: (message) => useToastStore.getState().push(message, "cobalt"),
};
