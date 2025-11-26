import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useCreateWarehouse,
  useWarehouses,
} from "../../entities/warehouse/model/useWarehouses";
import type { CreateWarehousePayload } from "../../entities/warehouse/model/types";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../entities/session/model/authStore";
import { WarehouseMap } from "../../widgets/map/WarehouseMap";

export const WarehousePage = () => {
  const navigate = useNavigate();

  // 1. React Query Hooks
  const { data: warehouses, isLoading } = useWarehouses();
  const { mutate: createWarehouse, isPending } = useCreateWarehouse();

  // Get user role from auth store
  const userRole = useAuthStore((state) => state.role);

  // Check if user is admin
  const isAdmin = userRole === "ADMIN";

  // Helper to set coords for Sri Lankan Cities (Click to fill)
  const setCityCoords = (lat: number, lng: number) => {
    setValue("latitude", lat);
    setValue("longitude", lng);
  };

  // 2. Form Setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWarehousePayload>();

  const onSubmit = (data: CreateWarehousePayload) => {
    // Send data to backend. We parse capacity as Number because HTML inputs return strings.
    createWarehouse(
      { ...data, 
        capacity: Number(data.capacity),
     },
      {
        onSuccess: () => reset(), // Clear form on success
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-blue-500">
            Warehouse Manager
          </h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div
          className={`grid grid-cols-1 ${
            isAdmin ? "md:grid-cols-3" : "md:grid-cols-1"
          } gap-8`}
        >
          {/* LEFT: Data Table */}
          <div
            className={`${
              isAdmin ? "md:col-span-2" : "md:col-span-1"
            } bg-gray-900 rounded-xl border border-gray-800 p-6`}
          >
            <h2 className="text-xl font-semibold mb-4">Current Locations</h2>

            {isLoading ? (
              <Loader2 className="animate-spin text-blue-500" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-gray-950 uppercase font-medium">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3 text-right">Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {warehouses?.map((wh) => (
                      <tr key={wh.id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-white">{wh.name}</td>
                        <td className="px-4 py-3">{wh.location}</td>
                        <td className="px-4 py-3 text-right font-mono text-blue-400">
                          {wh.capacity.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {warehouses?.length === 0 && (
                  <p className="text-center py-4 text-gray-500">
                    No warehouses found.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Create Form - Only visible for ADMIN */}
          {isAdmin && (
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Add New Warehouse</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Warehouse Name"
                  placeholder="e.g. Kandy Hub"
                  {...register("name", { required: "Name is required" })}
                  error={errors.name?.message}
                />
                <Input
                  label="Location"
                  placeholder="e.g. Kandy City"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  error={errors.location?.message}
                />
                <Input
                  label="Capacity"
                  type="number"
                  placeholder="e.g. 5000"
                  {...register("capacity", {
                    required: "Capacity is required",
                    min: 1,
                  })}
                  error={errors.capacity?.message}
                />

                <Button type="submit" className="w-full" isLoading={isPending}>
                  Create Warehouse
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
