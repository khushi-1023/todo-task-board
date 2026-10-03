import { createFileRoute, redirect } from "@tanstack/react-router";
import Dashboard from "../pages/Dashboard";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const isAuthenticated =
      localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: Dashboard,
});