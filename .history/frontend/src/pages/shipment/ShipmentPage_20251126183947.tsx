import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useShipments,
  useCreateShipment,
} from "../../entities/shipment/model/useShipments";
import { useProducts } from "../../entities/product/model/useProducts"; // Need this for the dropdown
import type { CreateShipmentPayload } from "../../entities/shipment";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { Loader2, Truck } from "lucide-react";

export const ShipmentPage = () => {
  const navigate = useNavigate();

  // 1. Hooks
  const { data: shipments, isLoading: loadingShipments } = useShipments();
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { mutate: createShipment, isPending } = useCreateShipment();

  // 2. Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateShipmentPayload>();

  const onSubmit = (data: CreateShipmentPayload) => {
    createShipment(
      {
        ...data,
        quantity: Number(data.quantity),
      },
      {
        onSuccess: () => reset(),
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-blue-500 flex items-center gap-2">
            <Truck /> Shipment Manager
          </h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Shipment History */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Outbound History</h2>

            {loadingShipments ? (
              <Loader2 className="animate-spin text-blue-500" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-gray-950 uppercase font-medium">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Destination</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Status</th>
                      <th className="px-4 py-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {shipments?.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-3 text-white">
                          {s.product?.name || "Unknown"}
                        </td>
                        <td className="px-4 py-3">{s.destination}</td>
                        <td className="px-4 py-3 text-right font-mono text-yellow-500">
                          -{s.quantity}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400">
                            {s.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-xs">
                          {new Date(s.shipmentDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {shipments?.length === 0 && (
                  <p className="text-center py-4 text-gray-500">
                    No shipments yet.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Create Shipment Form */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">
              Create Outbound Order
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Product Dropdown */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Select Product
                </label>
                {loadingProducts ? (
                  <p className="text-xs text-gray-500">Loading inventory...</p>
                ) : (
                  <select
                    className="flex h-9 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-sm text-gray-100 focus:ring-1 focus:ring-blue-600"
                    {...register("productId", {
                      required: "Product is required",
                    })}
                  >
                    <option value="">-- Choose Item --</option>
                    {products?.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock: {p.quantity})
                      </option>
                    ))}
                  </select>
                )}
                {errors.productId && (
                  <p className="text-xs text-red-500">
                    {errors.productId.message}
                  </p>
                )}
              </div>

              <Input
                label="Destination / Customer"
                placeholder="e.g. John Doe, Kandy"
                {...register("destination", { required: "Required" })}
                error={errors.destination?.message}
              />

              <Input
                label="Quantity to Ship"
                type="number"
                placeholder="0"
                {...register("quantity", { required: "Required", min: 1 })}
                error={errors.quantity?.message}
              />

              <Button
                type="submit"
                className="w-full"
                variant="destructive"
                isLoading={isPending}
              >
                Confirm Shipment
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
