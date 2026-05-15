import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { searchSchema } from "../schemas/seacrhSchema";

function SearchbarComponent() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  function handleSearch(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      setSearch("");
      navigate("/login", {
        state: {
          message: "You must be logged in to search news",
        },
      });
      return;
    }

    const result = searchSchema.safeParse({
      search,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    navigate(`/search?q=${encodeURIComponent(search)}`);
  }
  return (
    <form
      onSubmit={handleSearch}
      className="group flex w-full items-center gap-2 rounded-full border border-ink-750 bg-ink-850/80 py-1 pl-4 pr-1 transition-all duration-200 focus-within:border-amber-accent/60 focus-within:bg-ink-850 focus-within:shadow-glow-amber md:w-80"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0 text-ink-400 transition-colors group-focus-within:text-amber-accent"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="text"
        placeholder="Search news…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-ink-50 placeholder:text-ink-400 focus:outline-none"
      />

      <button
        type="submit"
        className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-accent px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-950 transition-all duration-200 hover:bg-amber-accent-hover active:scale-95"
      >
        Search
      </button>
    </form>
  );
}

export default SearchbarComponent;
