import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers } from "../../entities/user/api/userApi"; // Reuse existing
import { createUser } from "../../entities/user/api/userManagementApi";
import type { CreateUserPayload } from "../../entities/user/api/userManagementApi";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { toast } from "sonner";
import { Users, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UsersPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // 1. Fetch all users
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // 2. Create User Mutation
  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User Created Successfully");
      reset(); // Clear form
    },
    onError: (err: any) =>
      toast.error("Failed: " + err.response?.data?.message),
  });

  const { register, handleSubmit, reset } = useForm<CreateUserPayload>();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <Users /> User Management
          </h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: User List */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="text-blue-500" /> Employee Directory
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-gray-950 uppercase">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users?.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-white">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            u.role === "ADMIN"
                              ? "bg-purple-500/10 text-purple-400"
                              : u.role === "DRIVER"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: Create Form */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UserPlus className="text-green-500" /> Onboard Employee
            </h2>
            <form
              onSubmit={handleSubmit((data) => registerUser(data))}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  {...register("firstName", { required: true })}
                />
                <Input
                  placeholder="Last Name"
                  {...register("lastName", { required: true })}
                />
              </div>
              <Input
                placeholder="Email"
                type="email"
                {...register("email", { required: true })}
              />
              <Input
                placeholder="Password"
                type="password"
                {...register("password", { required: true })}
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Assign Role
                </label>
                <select
                  {...register("role")}
                  className="flex h-9 w-full rounded-md border border-gray-700 bg-gray-900 px-3 text-sm text-gray-100"
                >
                  <option value="MANAGER">Manager</option>
                  <option value="DRIVER">Driver</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <Button type="submit" className="w-full" isLoading={isPending}>
                Create Account
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
