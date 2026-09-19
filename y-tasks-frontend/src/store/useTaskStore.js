import { create } from "zustand";
import { TaskAPI, getErrorMessage } from "../lib/api";
import { toast } from "./useToastStore";

const PAGE_SIZE = 8;

export const useTaskStore = create((set, get) => ({
  tasks: [],
  totalTasks: 0,
  totalPages: 1,
  page: 1,
  status: "all", // all | active | done
  search: "",
  sort: "-createdAt",
  loading: false,
  initialized: false,

  reset: () =>
    set({
      tasks: [],
      totalTasks: 0,
      totalPages: 1,
      page: 1,
      status: "all",
      search: "",
      sort: "-createdAt",
      loading: false,
      initialized: false,
    }),

  fetchTasks: async () => {
    const { page, status, search, sort } = get();
    set({ loading: true });
    try {
      const params = { page, limit: PAGE_SIZE, sort };
      if (status !== "all") params.done = status === "done";
      if (search.trim()) params.search = search.trim();

      const res = await TaskAPI.list(params);
      set({
        tasks: res.data.tasks,
        totalTasks: res.data.totalTasks,
        totalPages: Math.max(1, res.data.totalPages),
        loading: false,
        initialized: true,
      });
    } catch (error) {
      set({ loading: false, initialized: true });
      if (error.message !== "SESSION_EXPIRED") {
        toast.error(getErrorMessage(error, "Couldn't load your tasks."));
      }
    }
  },

  setPage: (page) => {
    set({ page });
    get().fetchTasks();
  },

  setStatus: (status) => {
    set({ status, page: 1 });
    get().fetchTasks();
  },

  setSearch: (search) => {
    set({ search, page: 1 });
    get().fetchTasks();
  },

  setSort: (sort) => {
    set({ sort, page: 1 });
    get().fetchTasks();
  },

  addTask: async (taskName) => {
    try {
      await TaskAPI.create(taskName);
      // Jump back to the freshest page so the new task is visible under the
      // default newest-first sort, then reload.
      set({ page: 1 });
      await get().fetchTasks();
      toast.success("Task added.");
      return true;
    } catch (error) {
      if (error.message !== "SESSION_EXPIRED") {
        toast.error(getErrorMessage(error, "Couldn't add that task."));
      }
      return false;
    }
  },

  toggleDone: async (id, done) => {
    const previous = get().tasks;
    set({
      tasks: previous.map((t) => (t._id === id ? { ...t, done } : t)),
    });
    try {
      await TaskAPI.update(id, { done });
    } catch (error) {
      set({ tasks: previous });
      if (error.message !== "SESSION_EXPIRED") {
        toast.error(getErrorMessage(error, "Couldn't update that task."));
      }
    }
  },

  renameTask: async (id, taskName) => {
    const trimmed = taskName.trim();
    if (!trimmed) return false;
    const previous = get().tasks;
    set({
      tasks: previous.map((t) => (t._id === id ? { ...t, taskName: trimmed } : t)),
    });
    try {
      await TaskAPI.update(id, { taskName: trimmed });
      return true;
    } catch (error) {
      set({ tasks: previous });
      if (error.message !== "SESSION_EXPIRED") {
        toast.error(getErrorMessage(error, "Couldn't rename that task."));
      }
      return false;
    }
  },

  deleteTask: async (id) => {
    const previous = get().tasks;
    set({ tasks: previous.filter((t) => t._id !== id) });
    try {
      await TaskAPI.remove(id);
      toast.success("Task deleted.");
      // If that emptied the current page (and we're not on page 1), step back.
      const { tasks, page } = get();
      if (tasks.length === 0 && page > 1) {
        set({ page: page - 1 });
      }
      await get().fetchTasks();
    } catch (error) {
      set({ tasks: previous });
      if (error.message !== "SESSION_EXPIRED") {
        toast.error(getErrorMessage(error, "Couldn't delete that task."));
      }
    }
  },
}));
