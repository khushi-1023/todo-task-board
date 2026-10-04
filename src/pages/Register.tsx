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
  <div className="min-h-screen bg-[#FFF7F3] px-4 py-10">
    <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-[6px] border-2 border-[#D8CFC8] bg-[#FFFDFC] md:grid-cols-2">

        {/* Left pastel section */}
        <div className="hidden bg-[#E8DFF5] p-10 md:flex md:flex-col md:justify-center">
          <div className="max-w-sm">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[6px] border-2 border-[#B9A8D0] bg-[#F7F1FC] text-2xl font-bold text-[#4D3B5F]">
              ✓
            </div>

            <p className="mb-3 text-sm font-semibold tracking-widest text-[#735B85]">
              TASK BOARD
            </p>

            <h1 className="text-4xl font-black leading-tight text-[#35283D]">
              Plan it.
              <br />
              Organize it.
              <br />
              Finish it.
            </h1>

            <p className="mt-5 leading-7 text-[#66586D]">
              Create and manage your daily tasks with a simple,
              organized task board.
            </p>

            <div className="mt-8 flex gap-3">
              <span className="h-4 w-12 rounded-full bg-[#F8D7DA]" />
              <span className="h-4 w-12 rounded-full bg-[#DDECCF]" />
              <span className="h-4 w-12 rounded-full bg-[#FCE8B2]" />
            </div>
          </div>
        </div>

        {/* Register form */}
        <div className="bg-[#FFFDFC] p-7 sm:p-10">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold tracking-wider text-[#A56B7B]">
              GET STARTED
            </p>

            <h1 className="text-3xl font-black text-[#35283D]">
              Create Account
            </h1>

            <p className="mt-2 text-sm text-[#81757D]">
              Register to access your task board
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4F454B]">
                Full Name
              </label>

              <input
                {...register("name")}
                type="text"
                placeholder="Enter your name"
                className="w-full rounded-[6px] border-2 border-[#DDD3D0] bg-[#FFF9F7] px-4 py-3 text-[#35283D] outline-none transition placeholder:text-[#AAA0A5] focus:border-[#C89AA7] focus:bg-white focus:ring-4 focus:ring-[#F8DDE3]"
              />

              {errors.name && (
                <p className="mt-1.5 text-sm text-[#D65A6A]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4F454B]">
                Email
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-[6px] border-2 border-[#DDD3D0] bg-[#FFF9F7] px-4 py-3 text-[#35283D] outline-none transition placeholder:text-[#AAA0A5] focus:border-[#9CB8A4] focus:bg-white focus:ring-4 focus:ring-[#DDEDE1]"
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-[#D65A6A]">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4F454B]">
                Password
              </label>

              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-[6px] border-2 border-[#DDD3D0] bg-[#FFF9F7] px-4 py-3 text-[#35283D] outline-none transition placeholder:text-[#AAA0A5] focus:border-[#B5A0C9] focus:bg-white focus:ring-4 focus:ring-[#E9DFF2]"
              />

              {errors.password && (
                <p className="mt-1.5 text-sm text-[#D65A6A]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4F454B]">
                Confirm Password
              </label>

              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Confirm your password"
                className="w-full rounded-[6px] border-2 border-[#DDD3D0] bg-[#FFF9F7] px-4 py-3 text-[#35283D] outline-none transition placeholder:text-[#AAA0A5] focus:border-[#D3A98E] focus:bg-white focus:ring-4 focus:ring-[#FBE5D7]"
              />

              {errors.confirmPassword && (
                <p className="mt-1.5 text-sm text-[#D65A6A]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-[6px] border-2 border-[#789681] bg-[#A8C3AD] px-4 py-3 font-bold text-[#263B2D] transition hover:bg-[#96B69E] active:translate-y-px"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}

export default Register;