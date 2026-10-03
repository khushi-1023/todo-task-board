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

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],

  addTask: (title, description, status, userId) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status,
      userId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  updateTask: (id, title, description, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title,
              description,
              status,
            }
          : task
      ),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    }));
  },

  updateTaskStatus: (id, status) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status,
            }
          : task
      ),
    }));
  },
}));