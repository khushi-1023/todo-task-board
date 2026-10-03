import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useTaskStore, type TaskStatus } from "../store/taskStore";

const taskSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters"),
  status: z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

function EditTask() {
  const navigate = useNavigate();

  const { taskId } = useParams({
    from: "/edit-task/$taskId",
  });

  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);

  const task = tasks.find((item) => item.id === taskId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    values: task
      ? {
          title: task.title,
          description: task.description,
          status: task.status,
        }
      : undefined,
  });

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">
            Task not found
          </h1>

          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-4 rounded-md bg-black px-4 py-2 text-white"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: TaskFormData) => {
    updateTask(
      task.id,
      data.title,
      data.description,
      data.status as TaskStatus
    );

    alert("Task updated successfully!");

    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">
          Edit Task
        </h1>

        <p className="mb-6 mt-1 text-gray-500">
          Update your task details.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="mb-1 block font-medium">
              Task Title
            </label>

            <input
              {...register("title")}
              type="text"
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
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">
                Completed
              </option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                navigate({ to: "/dashboard" })
              }
              className="rounded-md border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-black px-5 py-2 text-white hover:bg-gray-800"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTask;