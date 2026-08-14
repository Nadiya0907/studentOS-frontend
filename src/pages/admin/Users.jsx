import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Trash2,
  Mail,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import EmptyState from "../../components/common/EmptyState";
import { adminService } from "../../services/adminService";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const response =
        await adminService.getUsers();

      const data =
        response?.data || response;

      setUsers(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Admin users error:",
        error
      );

      toast.error(
        "Unable to load admin users."
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await adminService.deleteUser(id);

      setUsers((current) =>
        current.filter(
          (user) => user.id !== id
        )
      );

      toast.success(
        "User deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      toast.error(
        "Delete user API is not implemented in the current backend yet."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-violet-400">
            StudentOS Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-white">
            Users
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage registered StudentOS users.
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          className="rounded-xl border border-bg-border bg-bg-hover px-4 py-2.5 text-xs font-semibold text-gray-300 hover:text-white"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="The backend did not return any users."
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="border-b border-bg-border bg-bg-hover">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                    User
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500">
                    Role
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-bg-border last:border-b-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-accent-gradient text-sm font-bold text-white">
                          {(user.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.name ||
                              "Unknown User"}
                          </p>

                          <p className="mt-0.5 text-[10px] text-gray-600">
                            ID: {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail size={14} />
                        {user.email || "N/A"}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-bg-border bg-bg-hover px-3 py-1.5 text-xs text-gray-300">
                        <Shield size={12} />
                        {user.role || "Student"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(user.id)
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}