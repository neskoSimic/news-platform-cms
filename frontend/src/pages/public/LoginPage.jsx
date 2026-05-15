import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { loginSchema } from "../../schemas/authSchema";
import { loginUser } from "../../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state?.message) {
      toast.error(location.state.message);
    }
  }, [location.state]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const result = loginSchema.safeParse({
        email,
        password,
      });

      if (!result.success) {
        const fieldErrors = {};

        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0]] = issue.message;
        });

        setErrors(fieldErrors);

        return;
      }

      setErrors({});

      const data = await loginUser(email, password);

      login(data.user, data.token);

      toast.success(data.message);

      navigate("/categories");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        {/* Editorial side panel */}
        <aside className="hidden lg:block">
          <p className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-accent">
            <span className="h-px w-8 bg-amber-accent/60" />
            Members&apos; entrance
          </p>
          <h2 className="mb-5 font-display text-5xl leading-[1.05] tracking-tight text-ink-50">
            Sign in to the <em className="text-amber-accent">Obsidian</em>{" "}
            newsroom.
          </h2>
          <p className="max-w-md text-base leading-7 text-ink-300">
            Manage stories, curate categories and follow your community of
            readers — all from a single, considered workspace.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-ink-300">
            {[
              "Editorial-grade content management",
              "Reader engagement at a glance",
              "Granular access for your team",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-amber-accent/40 bg-amber-soft text-amber-accent">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </aside>

        {/* Form card */}
        <div className="relative w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-amber-accent/20 via-transparent to-sky-accent/10 opacity-50 blur-xl" />

          <div className="reveal-up relative overflow-hidden rounded-3xl border border-ink-750 bg-ink-850/80 shadow-elev-2 backdrop-blur-xl">
            <div className="border-b border-ink-750 bg-ink-900/40 px-8 py-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 font-display text-2xl italic text-amber-accent shadow-glow-amber">
                O
              </span>
              <h1 className="mt-4 font-display text-3xl text-ink-50">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-ink-400">
                Enter your credentials to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-8 py-7">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300"
                >
                  Email address
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-10 5L2 7" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border bg-ink-900/60 py-3 pl-10 pr-4 text-sm text-ink-50 outline-none transition-all duration-200 focus:bg-ink-900 focus:shadow-glow-amber ${
                      errors.email
                        ? "border-rose-accent/60 focus:border-rose-accent"
                        : "border-ink-750 focus:border-amber-accent/60"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-rose-accent">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-ink-900/60 py-3 pl-10 pr-4 text-sm text-ink-50 outline-none transition-all duration-200 focus:bg-ink-900 focus:shadow-glow-amber ${
                      errors.password
                        ? "border-rose-accent/60 focus:border-rose-accent"
                        : "border-ink-750 focus:border-amber-accent/60"
                    }`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-rose-accent">
                    {errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-accent px-4 py-3 text-sm font-semibold text-ink-950 transition-all duration-200 hover:bg-amber-accent-hover hover:shadow-glow-amber active:scale-[0.99]"
              >
                <span>Sign in</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </button>

              <p className="pt-2 text-center text-xs text-ink-500">
                By continuing you agree to our editorial guidelines.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
