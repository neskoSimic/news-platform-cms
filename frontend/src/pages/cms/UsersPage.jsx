import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PaginationComponent from "../../components/PaginationComponent";
import TableComponent from "../../components/TableComponent";
import { useAuth } from "../../contexts/AuthContext";
import { createUserSchema, editUserSchema } from "../../schemas/userSchema";
import {
  createUser,
  getAllUsers,
  toggleStatus,
  updateUser,
} from "../../services/api";

function UserPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  let response;

  const [enabled, setEnabled] = useState(false);
  const [editingUsers, setEditingUsers] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function fetchUsers(page, limit) {
    try {
      const response = await getAllUsers(page, limit);

      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);

      toast.error(error.response?.data?.message || "Failed to fetch users");
    }
  }

  useEffect(() => {
    fetchUsers(page, limit);
  }, [page]);

  function handleChangePage(newPage) {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setSearchParams({
      page: newPage,
    });
  }
  function handleAdd() {
    setEnabled((prev) => !prev);
  }

  function handleEdit(users) {
    setEnabled(true);

    setEditingUsers(users);

    setFirstName(users.first_name);
    setLastName(users.last_name);
    setEmail(users.email);
    setUserType(users.user_type);
  }

  async function handleToggleStatus(users) {
    setEditingUsers(users);

    try {
      response = await toggleStatus(users.id);
      toast.success(response.message);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const schema = editingUsers ? editUserSchema : createUserSchema;

    const result = schema.safeParse({
      first_name: firstName,
      last_name: lastName,
      email: email,
      user_type: userType,
      password: password,
      confirm_password: confirmPassword,
    });

    if (!result.success) {
      const firstError = result.error.issues[0].message;

      toast.error(firstError);

      return;
    }

    try {
      if (editingUsers) {
        const body = {
          email: email,
          first_name: firstName,
          last_name: lastName,
          user_type: userType,
        };
        response = await updateUser(editingUsers.id, body);
      } else {
        const body = {
          email: email,
          first_name: firstName,
          last_name: lastName,
          password: password,
          confirm_password: confirmPassword,
          user_type: userType,
        };
        response = await createUser(body);
      }

      toast.success(response.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      fetchUsers();

      setEditingUsers(null);
      setEnabled(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  const columns = [
    {
      header: "Type",
      render: (users) => users.user_type,
    },
    {
      header: "First and Last name",
      render: (users) => users.first_name + " " + users.last_name,
    },
    {
      header: "Email",
      render: (users) => users.email,
    },
    {
      header: "Actions",
      render: (user) => {
        return (
          <>
            {user.user_type === "user" && (
              <button onClick={() => handleToggleStatus(user)}>
                {user.status === "active" ? "Deactivate" : "Activate"}
              </button>
            )}

            <button onClick={() => handleEdit(user)}>Edit</button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <TableComponent columns={columns} data={users} />

      <button
        onClick={handleAdd}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        {enabled ? "Close Form" : "Add User"}
      </button>

      {enabled && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                First Name
              </label>

              <input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Last Name
              </label>

              <input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              User Type
            </label>

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="admin">Administrator</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {!editingUsers && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="mt-6 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            {editingUsers ? "Update User" : "Create User"}
          </button>
        </form>
      )}

      {totalPages > 0 && (
        <div className="mt-6 flex justify-center">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
}
export default UserPage;
