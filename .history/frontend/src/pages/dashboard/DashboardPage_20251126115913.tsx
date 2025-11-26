import { useAuthStore } from "../../entities/session/model/authStore";
import { Button } from "../../shared/ui/Button";
import { useUsers } from "../../entities/user/model/useUsers";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const DashboardPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useInventorySocket();

  // 1. Use the Hook
  const { data: users, isLoading, isError } = useUsers();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-500">
              AuthnLogix Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your supply chain identities
            </p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        {/* Data Section */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold">System Users</h2>
          </div>

          <div className="p-6">
            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            )}

            {/* Error State */}
            {isError && (
              <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
                Failed to load users. Are you sure the backend is running and
                you are logged in?
              </div>
            )}

            {/* Data Table */}
            {users && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-gray-950 text-gray-100 uppercase font-medium">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs">
                          {user.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-white font-medium">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.active
                                ? "bg-green-500/10 text-green-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {user.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* New Warehouse Navigation Card */}
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Warehouse Management</h3>
            <p className="text-sm text-gray-400">
              Track inventory locations and capacity.
            </p>
          </div>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/warehouses")}
          >
            Manage Warehouses
          </Button>
        </div>
        {/* New Product Navigation Card */}
        <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Inventory Control</h3>
            <p className="text-sm text-gray-400">
              Add products and manage stock levels.
            </p>
          </div>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => navigate("/products")}
          >
            Manage Products
          </Button>
        </div>
      </div>
    </div>
  );
};
