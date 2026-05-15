import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import NavBarCategoriesComponent from "./NavBarCategoriesComponent";
import SearchbarComponent from "./SearchbarComponent";

function NavbarComponent() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-ink-750/70 bg-ink-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-ink-950/60">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3.5 sm:px-6 lg:px-10">
        {/* Brand */}
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="Obsidian — home"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 font-display text-lg italic text-amber-accent shadow-elev-1 transition-all duration-200 group-hover:border-amber-accent/60 group-hover:shadow-glow-amber">
            O
          </span>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-tight text-ink-50">
              Obsidian
            </span>
            <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-ink-400">
              Editorial
            </span>
          </div>
        </Link>

        <span className="hidden h-6 w-px bg-ink-750 md:inline-block" />

        {!user ? (
          <>
            {/* GUEST NAVBAR */}
            <div className="flex flex-1 flex-wrap items-center gap-1">
              <Link
                to="/"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-200 transition-colors duration-200 hover:bg-ink-800 hover:text-ink-50"
              >
                Home
              </Link>

              <Link
                to="/most-read"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-200 transition-colors duration-200 hover:bg-ink-800 hover:text-ink-50"
              >
                Most Read
              </Link>

              <span className="mx-1 hidden h-4 w-px bg-ink-750 md:inline-block" />

              <NavBarCategoriesComponent />
            </div>

            <div className="order-last w-full md:order-none md:w-auto md:flex-none">
              <SearchbarComponent />
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-accent/40 bg-amber-soft px-4 py-1.5 text-sm font-semibold text-amber-accent transition-all duration-200 hover:border-amber-accent hover:bg-amber-accent hover:text-ink-950 hover:shadow-glow-amber"
              >
                Sign in
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* LOGGED USER NAVBAR */}
            <div className="flex flex-1 flex-wrap items-center gap-1">
              <Link
                to="/categories"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-200 transition-colors duration-200 hover:bg-ink-800 hover:text-ink-50"
              >
                Categories
              </Link>

              <Link
                to="/news"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-ink-200 transition-colors duration-200 hover:bg-ink-800 hover:text-ink-50"
              >
                News
              </Link>
            </div>
            {user.user_type === "admin" && (
              <div className="flex items-center gap-1">
                <Link
                  to="/users"
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-ink-200 transition-colors duration-200 hover:bg-ink-800 hover:text-ink-50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-accent" />
                  Users
                </Link>
              </div>
            )}

            <div className="order-last w-full md:order-none md:w-auto md:flex-none">
              <SearchbarComponent />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2.5 rounded-full border border-ink-750 bg-ink-850 py-1 pl-1 pr-3 sm:inline-flex">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-accent/30 to-amber-accent/10 text-xs font-bold text-amber-accent">
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </span>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-semibold text-ink-50">
                    {user.first_name} {user.last_name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-ink-400">
                    {user.user_type}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-md border border-ink-750 bg-ink-850 px-3 py-1.5 text-sm font-medium text-ink-200 transition-all duration-200 hover:border-rose-accent/50 hover:bg-rose-soft hover:text-rose-accent"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavbarComponent;
