import { createFileRoute, redirect } from "@tanstack/react-router";
import CreateTask from "../pages/CreateTask";

export const Route = createFileRoute("/create-task")({
  beforeLoad: () => {
    const isAuthenticated =
      localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: CreateTask,
});