import { useAuthStore } from "../../entities/users/model/authStore";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "react-router-dom";

export const DashboardPage = () => {
  const { logout, token } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b border-gray-800 pb-6">
          <h1 className="text-3xl font-bold text-blue-500">
            AuthnLogix Dashboard
          </h1>
          <Button variant="destructive" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Security Status</h3>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
              Authenticated
            </div>
          </div>

          <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 col-span-2">
            <h3 className="text-lg font-semibold mb-2">Your Session Token</h3>
            <p className="text-xs text-gray-500 font-mono break-all bg-black p-4 rounded-md">
              {token}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
