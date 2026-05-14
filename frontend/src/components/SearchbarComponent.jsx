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
    <form onSubmit={handleSearch} className="flex">
      <input
        type="text"
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Search News
      </button>
    </form>
  );
}

export default SearchbarComponent;
