import { create } from "zustand";

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt: string;
};

type TaskStore = {
  tasks: Task[];

  addTask: (
    title: string,
    description: string,
    status: TaskStatus,
    userId: string
  ) => void;

  updateTask: (
    id: string,
    title: string,
    description: string,
    status: TaskStatus
  ) => void;

  deleteTask: (id: string) => void;

  updateTaskStatus: (id: string, status: TaskStatus) => void;
};

const getStoredTasks = (): Task[] => {
  const storedTasks = localStorage.getItem("tasks");

  if (!storedTasks) {
    return [];
  }

  try {
    return JSON.parse(storedTasks);
  } catch {
    return [];
  }
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: getStoredTasks(),

  addTask: (title, description, status, userId) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status,
      userId,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedTasks = [...state.tasks, newTask];

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      return {
        tasks: updatedTasks,
      };
    });
  },

  updateTask: (id, title, description, status) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title,
              description,
              status,
            }
          : task
      );

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      return {
        tasks: updatedTasks,
      };
    });
  },

  deleteTask: (id) => {
    set((state) => {
      const updatedTasks = state.tasks.filter(
        (task) => task.id !== id
      );

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      return {
        tasks: updatedTasks,
      };
    });
  },

  updateTaskStatus: (id, status) => {
    set((state) => {
      const updatedTasks = state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
            }
          : task
      );

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      return {
        tasks: updatedTasks,
      };
    });
  },
}));