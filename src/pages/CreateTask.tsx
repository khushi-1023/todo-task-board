import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";
import { useTaskStore, type TaskStatus } from "../store/taskStore";

const taskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

function CreateTask() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const addTask = useTaskStore((state) => state.addTask);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: "TODO",
    },
  });

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  const onSubmit = (data: TaskFormData) => {
    addTask(
      data.title,
      data.description,
      data.status as TaskStatus,
      user.email
    );

    alert("Task created successfully!");

    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Create New Task</h1>

        <p className="mt-1 mb-6 text-gray-500">
          Add a new task to your task board.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1 block font-medium">
              Task Title
            </label>

            <input
              {...register("title")}
              type="text"
              placeholder="Enter task title"
              className="w-full rounded-md border p-3"
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Description
            </label>

            <textarea
              {...register("description")}
              placeholder="Enter task description"
              rows={5}
              className="w-full rounded-md border p-3"
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Status
            </label>

            <select
              {...register("status")}
              className="w-full rounded-md border p-3"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard" })}
              className="rounded-md border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;