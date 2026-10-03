import { create } from "zustand";

type User = {
  name: string;
  email: string;
  password: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  registerUser: (user: User) => void;
  loginUser: (email: string, password: string) => boolean;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => {
  const storedUser = localStorage.getItem("user");
  const storedAuth = localStorage.getItem("isAuthenticated");

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: storedAuth === "true",

    registerUser: (user) => {
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        isAuthenticated: false,
      });
    },

    loginUser: (email, password) => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return false;
      }

      const user: User = JSON.parse(storedUser);

      if (user.email === email && user.password === password) {
        localStorage.setItem("isAuthenticated", "true");

        set({
          user,
          isAuthenticated: true,
        });

        return true;
      }

      return false;
    },

    logout: () => {
      localStorage.removeItem("isAuthenticated");

      set({
        user: null,
        isAuthenticated: false,
      });
    },
  };
});