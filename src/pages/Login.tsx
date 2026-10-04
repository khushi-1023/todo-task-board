import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "../store/authStore";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function Login() {
  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.loginUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    const success = loginUser(data.email, data.password);

    if (success) {
      navigate({ to: "/dashboard" });
    } else {
      alert("Invalid email or password");
    }
  };

  return (
  <div className="min-h-screen bg-[#F3F0FA] px-4 py-10">
    <div className="mx-auto flex min-h-[90vh] max-w-5xl items-center justify-center">
      <div className="grid w-full overflow-hidden rounded-[6px] border-2 border-[#D4CCE0] bg-[#FFFDFC] md:grid-cols-2">

        {/* Left pastel section */}
        <div className="hidden bg-[#DDEDE5] p-10 md:flex md:flex-col md:justify-center">
          <div className="max-w-sm">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[6px] border-2 border-[#AFC8B8] bg-[#F2FAF5] text-2xl font-bold text-[#466250]">
              ✓
            </div>

            <p className="mb-3 text-sm font-semibold tracking-widest text-[#63816D]">
              WELCOME BACK
            </p>

            <h1 className="text-4xl font-black leading-tight text-[#304238]">
              Your tasks.
              <br />
              Your progress.
              <br />
              Your space.
            </h1>

            <p className="mt-5 leading-7 text-[#68776E]">
              Stay organized and keep track of everything you need
              to get done.
            </p>

            <div className="mt-8 flex gap-3">
              <span className="h-4 w-12 rounded-full bg-[#F6D6DC]" />
              <span className="h-4 w-12 rounded-full bg-[#D7E9D5]" />
              <span className="h-4 w-12 rounded-full bg-[#F9E4AD]" />
            </div>
          </div>
        </div>

        {/* Login form */}
        <div className="bg-[#FFFDFC] p-7 sm:p-10">
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold tracking-wider text-[#7187A8]">
              WELCOME BACK
            </p>

            <h1 className="text-3xl font-black text-[#303442]">
              Login
            </h1>

            <p className="mt-2 text-sm text-[#817F87]">
              Login to access your task board
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4C4B54]">
                Email
              </label>

              <input
                {...register("email")}
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-[6px] border-2 border-[#D8D4DD] bg-[#FAF8FC] px-4 py-3 text-[#303442] outline-none transition placeholder:text-[#A5A1AA] focus:border-[#9CAFD0] focus:bg-white focus:ring-4 focus:ring-[#E3EAF7]"
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-[#D65A6A]">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#4C4B54]">
                Password
              </label>

              <input
                {...register("password")}
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-[6px] border-2 border-[#D8D4DD] bg-[#FAF8FC] px-4 py-3 text-[#303442] outline-none transition placeholder:text-[#A5A1AA] focus:border-[#B6A4C8] focus:bg-white focus:ring-4 focus:ring-[#EAE1F2]"
              />

              {errors.password && (
                <p className="mt-1.5 text-sm text-[#D65A6A]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-[6px] border-2 border-[#8297B8] bg-[#AFC0D9] px-4 py-3 font-bold text-[#29384E] transition hover:bg-[#9FB3CF] active:translate-y-px"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;