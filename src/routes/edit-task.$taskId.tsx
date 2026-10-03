import { createFileRoute } from "@tanstack/react-router";
import EditTask from "../pages/EditTask";

export const Route = createFileRoute("/edit-task/$taskId")({
  component: EditTask,
});