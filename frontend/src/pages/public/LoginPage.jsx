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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login Page
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
