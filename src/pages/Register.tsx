import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function Register() {
  const navigate = useNavigate();

  const registerUser = useAuthStore((state) => state.registerUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    alert("Registration successful!");

    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Register to access your task board
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Full Name</label>

            <input
              {...register("name")}
              type="text"
              placeholder="Enter your name"
              className="w-full rounded-md border p-2"
            />

            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>

            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md border p-2"
            />

            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>

            <input
              {...register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md border p-2"
            />

            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Confirm Password
            </label>

            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm your password"
              className="w-full rounded-md border p-2"
            />

            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;