import { useAuthStore } from "../store/authStore";
import {
  useTaskStore,
  type TaskStatus,
} from "../store/taskStore";
import { useNavigate } from "@tanstack/react-router";

import {
  DndContext,
  type DragEndEvent,
  closestCorners,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

const columns: {
  status: TaskStatus;
  title: string;
}[] = [
  { status: "TODO", title: "To Do" },
  { status: "IN_PROGRESS", title: "In Progress" },
  { status: "REVIEW", title: "Review" },
  { status: "COMPLETED", title: "Completed" },
];

function TaskCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id,
  });

  const deleteTask = useTaskStore((state) => state.deleteTask);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      deleteTask(id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
      >
        <h4 className="font-semibold text-gray-900">
          {title}
        </h4>

        <p className="mt-2 text-sm leading-5 text-gray-600">
          {description}
        </p>
      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={() => alert("Edit feature coming next")}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function TaskColumn({
  status,
  title,
  tasks,
}: {
  status: TaskStatus;
  title: string;
  tasks: {
    id: string;
    title: string;
    description: string;
  }[];
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <section
      ref={setNodeRef}
      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
    >
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      <div className="min-h-[250px] space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex min-h-[180px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-center text-sm text-gray-400">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
}

function Dashboard() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const tasks = useTaskStore((state) => state.tasks);
  const updateTaskStatus = useTaskStore(
    (state) => state.updateTaskStatus
  );

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  const userTasks = tasks.filter(
    (task) => task.userId === user.email
  );

  const totalTasks = userTasks.length;

  const inProgress = userTasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const inReview = userTasks.filter(
    (task) => task.status === "REVIEW"
  ).length;

  const completed = userTasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id) as TaskStatus;

    updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              To-Do Task Board
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user.name}
            </p>
          </div>

          <button
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Dashboard heading */}
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your tasks and track your progress.
              </p>
            </div>

            <button
              onClick={() => navigate({ to: "/create-task" })}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              + Create Task
            </button>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Task Overview
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Tasks
              </p>

              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {totalTasks}
              </h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                In Progress
              </p>

              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {inProgress}
              </h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                In Review
              </p>

              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {inReview}
              </h3>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <h3 className="mt-2 text-3xl font-bold text-gray-900">
                {completed}
              </h3>
            </div>
          </div>
        </section>

        {/* Kanban Board */}
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              My Tasks
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Drag and drop tasks to update their status.
            </p>
          </div>

          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {columns.map((column) => {
                const columnTasks = userTasks.filter(
                  (task) => task.status === column.status
                );

                return (
                  <TaskColumn
                    key={column.status}
                    status={column.status}
                    title={column.title}
                    tasks={columnTasks}
                  />
                );
              })}
            </div>
          </DndContext>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;