import { createFileRoute, redirect } from "@tanstack/react-router";
import EditTask from "../pages/EditTask";

export const Route = createFileRoute("/edit-task/$taskId")({
  beforeLoad: () => {
    const isAuthenticated =
      localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: EditTask,
});