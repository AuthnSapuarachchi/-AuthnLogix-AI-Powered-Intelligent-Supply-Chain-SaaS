import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/axios";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  details: string;
}

export const AuditPage = () => {
  const navigate = useNavigate();

  const {
    data: logs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["audit"],
    queryFn: async () => {
      const res = await api.get<AuditLog[]>("/audit");
      return res.data;
    },
  });

  if (isError)
    return <div className="p-8 text-red-500">Access Denied (Admins Only)</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <ShieldAlert /> System Audit Logs
          </h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="animate-spin text-blue-500" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-gray-950 uppercase font-medium">
                <tr>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {log.performedBy}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
