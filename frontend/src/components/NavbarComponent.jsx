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
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-bold text-white">News Site</div>

        {!user ? (
          <>
            {/* GUEST NAVBAR */}
            <div className="space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white">
                Home
              </Link>

              <Link to="/most-read" className="text-gray-300 hover:text-white">
                Most-read
              </Link>

              <NavBarCategoriesComponent />
            </div>

            <div>
              <SearchbarComponent />
            </div>

            <div className="space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* LOGGED USER NAVBAR */}
            <div className="space-x-4">
              <Link to="/categories" className="text-gray-300 hover:text-white">
                Categories
              </Link>

              <Link to="/news" className="text-gray-300 hover:text-white">
                News
              </Link>
            </div>
            {user.user_type === "admin" && (
              <div className="space-x-4">
                <Link to="/users" className="text-gray-300 hover:text-white">
                  Users
                </Link>
              </div>
            )}

            <div>
              <SearchbarComponent />
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-300">
                Welcome, {user.first_name} {user.last_name}
              </span>

              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
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
