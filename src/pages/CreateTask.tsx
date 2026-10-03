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
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Task
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add a new task to your task board.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-7">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {/* Task Title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Task Title
                </label>

                <input
                  {...register("title")}
                  type="text"
                  placeholder="Enter task title"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                />

                {errors.title && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Description
                </label>

                <textarea
                  {...register("description")}
                  placeholder="Enter task description"
                  rows={5}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                />

                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Status
                </label>

                <select
                  {...register("status")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                {errors.status && (
                  <p className="mt-1.5 text-sm text-red-500">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate({ to: "/dashboard" })}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateTask;