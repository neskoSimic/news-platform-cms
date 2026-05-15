import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PaginationComponent from "../../components/PaginationComponent";
import TableComponent from "../../components/TableComponent";
import { createUserSchema, editUserSchema } from "../../schemas/userSchema";
import {
  createUser,
  getAllUsers,
  toggleStatus,
  updateUser,
} from "../../services/api";

function UserPage() {
  const [users, setUsers] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

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
      const response = await toggleStatus(users.id);
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
      let response;
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
      render: (users) => {
        const isAdmin = users.user_type === "admin";
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isAdmin
                ? "border-amber-accent/40 bg-amber-soft text-amber-accent"
                : "border-ink-700 bg-ink-900 text-ink-300"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isAdmin ? "bg-amber-accent" : "bg-ink-400"
              }`}
            />
            {users.user_type}
          </span>
        );
      },
    },
    {
      header: "Name",
      render: (users) => (
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-sky-accent/30 to-sky-accent/10 font-mono text-xs font-bold text-sky-accent">
            {users.first_name?.[0]}
            {users.last_name?.[0]}
          </span>
          <span className="font-medium text-ink-50">
            {users.first_name} {users.last_name}
          </span>
        </div>
      ),
    },
    {
      header: "Email",
      render: (users) => (
        <span className="font-mono text-xs text-ink-300">{users.email}</span>
      ),
    },
    {
      header: "Status",
      render: (users) => {
        if (users.user_type !== "user") {
          return <span className="text-xs text-ink-500">—</span>;
        }

        const isActive = users.status === "active";
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isActive
                ? "border-emerald-accent/40 bg-emerald-soft text-emerald-accent"
                : "border-rose-accent/40 bg-rose-soft text-rose-accent"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-emerald-accent" : "bg-rose-accent"
              }`}
            />
            {isActive ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (user) => {
        const isActive = user.status === "active";

        return (
          <div className="flex items-center justify-end gap-2">
            {user.user_type === "user" && (
              <button
                onClick={() => handleToggleStatus(user)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "border-rose-accent/50 bg-rose-soft text-rose-accent hover:bg-rose-accent hover:text-ink-950"
                    : "border-emerald-accent/50 bg-emerald-soft text-emerald-accent hover:bg-emerald-accent hover:text-ink-950"
                }`}
              >
                {isActive ? (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m4.93 4.93 14.14 14.14" />
                    </svg>
                    Deactivate
                  </>
                ) : (
                  <>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m9 12 2 2 4-4" />
                    </svg>
                    Activate
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => handleEdit(user)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-all duration-200 hover:border-sky-accent/50 hover:bg-sky-soft hover:text-sky-accent"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink-750/70 pb-6">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-accent">
            <span className="h-px w-8 bg-amber-accent/60" />
            CMS · Access control
          </p>
          <h1 className="font-display text-4xl tracking-tight text-ink-50">
            Users
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-400">
            Provision new accounts, adjust roles and toggle access for any
            non-admin user.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            enabled
              ? "border border-ink-700 bg-ink-850 text-ink-200 hover:border-rose-accent/40 hover:bg-rose-soft hover:text-rose-accent"
              : "bg-amber-accent text-ink-950 hover:bg-amber-accent-hover hover:shadow-glow-amber"
          }`}
        >
          {enabled ? (
            <>
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
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Close form
            </>
          ) : (
            <>
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
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add user
            </>
          )}
        </button>
      </header>

      {enabled && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 overflow-hidden rounded-2xl border border-ink-750 bg-ink-850/60 shadow-elev-1"
        >
          <div className="border-b border-ink-750 bg-ink-900/40 px-6 py-4">
            <h2 className="font-display text-lg text-ink-50">
              {editingUsers ? "Edit user" : "New user"}
            </h2>
            <p className="mt-1 text-xs text-ink-400">
              {editingUsers
                ? "Update profile details and permissions."
                : "Create an account with a temporary password."}
            </p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                  First name
                </label>

                <input
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                  Last name
                </label>

                <input
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="jane@obsidian.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
                />
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                  User type
                </label>

                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-ink-750 bg-ink-900/60 bg-[length:14px] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  }}
                >
                  <option value="admin">Administrator</option>
                  <option value="user">User</option>
                </select>
              </div>
            </div>

            {!editingUsers && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                    Confirm password
                  </label>

                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-accent px-5 py-2.5 text-sm font-semibold text-ink-950 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {editingUsers ? "Update user" : "Create user"}
              </button>
            </div>
          </div>
        </form>
      )}

      <TableComponent columns={columns} data={users} />

      {totalPages > 0 && (
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      )}
    </div>
  );
}
export default UserPage;
