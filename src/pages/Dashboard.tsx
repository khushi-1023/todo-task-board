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
      className="rounded-[6px] border-2 border-[#D2CDC2] bg-[#FFFDF7] p-4 shadow-none transition hover:-translate-y-1"
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#D2CDC2] bg-[#FCEEA9] text-sm font-bold text-[#1A2E24]">
            T
          </div>

          <span className="rounded-[6px] bg-[#E8F0E5] px-2.5 py-1 text-xs font-medium text-[#1A2E24]">
            Task
          </span>
        </div>

        <h4 className="font-semibold text-[#1A2E24]">
          {title}
        </h4>

        <p className="mt-2 text-sm leading-5 text-[#68756D]">
          {description}
        </p>
      </div>

      <div className="mt-4 flex gap-2 border-t-2 border-[#EEEAE1] pt-3">
        <button
          onClick={() =>
            window.location.href = `/edit-task/${id}`
          }
          className="flex-1 rounded-[6px] border-2 border-[#AFC7B5] bg-[#E4F1E7] px-3 py-2 text-sm font-medium text-[#1A2E24] transition hover:bg-[#D5E9DA]"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          className="flex-1 rounded-[6px] border-2 border-[#E8B4B4] bg-[#FDE2E2] px-3 py-2 text-sm font-medium text-[#9B2C2C] transition hover:bg-[#FACCCC]"
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

  const columnStyles = {
    TODO: "border-[#C8D8E8] bg-[#EEF5FA]",
    IN_PROGRESS: "border-[#DCCEEA] bg-[#F3ECF8]",
    REVIEW: "border-[#E8D9A8] bg-[#FBF6DF]",
    COMPLETED: "border-[#C9E4D0] bg-[#EEF8F0]",
  };

  const titleStyles = {
    TODO: "text-[#315A73]",
    IN_PROGRESS: "text-[#684B7A]",
    REVIEW: "text-[#806B2A]",
    COMPLETED: "text-[#356044]",
  };

  const badgeStyles = {
    TODO: "bg-[#DDEBF5] text-[#315A73]",
    IN_PROGRESS: "bg-[#E7DDF1] text-[#684B7A]",
    REVIEW: "bg-[#F4E9B8] text-[#806B2A]",
    COMPLETED: "bg-[#D9EEDC] text-[#356044]",
  };

  return (
    <section
      ref={setNodeRef}
      className={`rounded-[6px] border-2 p-4 shadow-none ${columnStyles[status]}`}
    >
      <div className="mb-4 flex items-center justify-between border-b-2 border-black/5 pb-3">
        <h3
          className={`font-bold ${titleStyles[status]}`}
        >
          {title}
        </h3>

        <span
          className={`rounded-[6px] px-3 py-1 text-xs font-bold ${badgeStyles[status]}`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="min-h-[280px] space-y-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            title={task.title}
            description={task.description}
          />
        ))}

        {tasks.length === 0 && (
          <div className="flex min-h-[200px] items-center justify-center rounded-[6px] border-2 border-dashed border-[#D2CDC2] bg-[#FFFDF7]/70 text-center text-sm text-[#8A8F8B]">
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
    <div className="min-h-screen bg-[#F8F5EC]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b-2 border-[#D2CDC2] bg-[#FFFDF7]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border-2 border-[#1A2E24] bg-[#CFE8D5] font-bold text-[#1A2E24]">
              ✓
            </div>

            <div>
              <h1 className="text-lg font-bold text-[#1A2E24]">
                TaskBoard
              </h1>

              <p className="text-xs text-[#68756D]">
                Manage your work
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-[#1A2E24]">
                {user.name}
              </p>

              <p className="text-xs text-[#68756D]">
                {user.email}
              </p>
            </div>

            <button
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              className="rounded-[6px] border-2 border-[#D2CDC2] bg-[#FFFDF7] px-4 py-2 text-sm font-semibold text-[#1A2E24] shadow-none transition hover:bg-[#FCEEA9]"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Welcome Section */}
        <section className="mb-8 overflow-hidden rounded-[6px] border-2 border-[#1A2E24] bg-[#DDEBF7] p-7 text-[#1A2E24] shadow-none">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="mb-2 text-sm font-medium text-[#53665C]">
                Welcome back 👋
              </p>

              <h2 className="text-3xl font-bold">
                {user.name}
              </h2>

              <p className="mt-2 max-w-lg text-sm text-[#53665C]">
                Manage your tasks, track your progress, and stay
                productive from one place.
              </p>
            </div>

            <button
              onClick={() =>
                navigate({ to: "/create-task" })
              }
              className="rounded-[6px] border-2 border-[#1A2E24] bg-[#FCEEA9] px-5 py-3 text-sm font-bold text-[#1A2E24] shadow-none transition hover:bg-[#F8E69A]"
            >
              + Create Task
            </button>

          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8">

          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#1A2E24]">
              Task Overview
            </h3>

            <p className="mt-1 text-sm text-[#68756D]">
              Here's a quick look at your current progress.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total */}
            <div className="rounded-[6px] border-2 border-[#D2CDC2] bg-[#FCEEA9] p-5 shadow-none transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#68756D]">
                    Total Tasks
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#1A2E24]">
                    {totalTasks}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-[#D2CDC2] bg-[#FFFDF7] text-xl text-[#1A2E24]">
                  📋
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="rounded-[6px] border-2 border-[#C8D8E8] bg-[#DDEBF7] p-5 shadow-none transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#68756D]">
                    In Progress
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#1A2E24]">
                    {inProgress}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-[#C8D8E8] bg-[#EEF5FA] text-xl text-[#315A73]">
                  ⚡
                </div>
              </div>
            </div>

            {/* Review */}
            <div className="rounded-[6px] border-2 border-[#DCCEEA] bg-[#EDE3F8] p-5 shadow-none transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#68756D]">
                    In Review
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#1A2E24]">
                    {inReview}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-[#DCCEEA] bg-[#F3ECF8] text-xl text-[#684B7A]">
                  👀
                </div>
              </div>
            </div>

            {/* Completed */}
            <div className="rounded-[6px] border-2 border-[#C9E4D0] bg-[#DDF2E3] p-5 shadow-none transition hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#68756D]">
                    Completed
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#1A2E24]">
                    {completed}
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-[#C9E4D0] bg-[#EEF8F0] text-xl text-[#356044]">
                  ✓
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Kanban */}
        <section>

          <div className="mb-5">
            <h3 className="text-xl font-bold text-[#1A2E24]">
              My Tasks
            </h3>

            <p className="mt-1 text-sm text-[#68756D]">
              Drag and drop tasks between columns to update their
              status.
            </p>
          </div>

          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

              {columns.map((column) => {
                const columnTasks = userTasks.filter(
                  (task) =>
                    task.status === column.status
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