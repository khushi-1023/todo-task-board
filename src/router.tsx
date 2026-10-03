import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import App from "./App";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";

const rootRoute = createRootRoute({
  component: App,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const createTaskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-task",
  component: CreateTask,
});

const editTaskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/edit-task/$taskId",
  component: EditTask,
});

const routeTree = rootRoute.addChildren([
  registerRoute,loginRoute,dashboardRoute, createTaskRoute , editTaskRoute
]);

export const router = createRouter({
  routeTree,
});