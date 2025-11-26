import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  useProducts,
  useCreateProduct,
} from "../../entities/product/model/useProducts";
import { useWarehouses } from "../../entities/warehouse/model/useWarehouses"; // Reuse this hook!
import type { CreateProductPayload } from "../../entities/product/model/types";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { Loader2, QrCode, X } from "lucide-react";
import QRCode from "react-qr-code";


export const ProductPage = () => {
  const navigate = useNavigate();

  // 1. Data Fetching (Parallel Queries)
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: warehouses, isLoading: loadingWarehouses } = useWarehouses();

  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  // 2. Mutation
  const { mutate: createProduct, isPending } = useCreateProduct();

  // 3. Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProductPayload>();

  const onSubmit = (data: CreateProductPayload) => {
    // Convert strings to numbers for the backend
    createProduct(
      {
        ...data,
        price: Number(data.price),
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <h1 className="text-3xl font-bold text-blue-500">
            Inventory Manager
          </h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Product List */}
          <div className="lg:col-span-2 bg-gray-900 rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold mb-4">Stock Overview</h2>

            {loadingProducts ? (
              <Loader2 className="animate-spin text-blue-500" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                  <thead className="bg-gray-950 uppercase font-medium">
                    <tr>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3 text-right">Price ($)</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {products?.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-3 font-mono text-xs text-yellow-500">
                          {p.sku}
                        </td>
                        <td className="px-4 py-3 text-white">{p.name}</td>
                        <td className="px-4 py-3 text-right">
                          {p.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-400">
                          {p.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products?.length === 0 && (
                  <p className="text-center py-4 text-gray-500">
                    No products found.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Add Inventory Form */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-fit">
            <h2 className="text-xl font-semibold mb-4">Add Stock</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Warehouse Dropdown */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300">
                  Target Warehouse
                </label>
                {loadingWarehouses ? (
                  <p className="text-xs text-gray-500">Loading locations...</p>
                ) : (
                  <select
                    className="flex h-9 w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-1 text-sm text-gray-100 focus:ring-1 focus:ring-blue-600"
                    {...register("warehouseId", {
                      required: "Warehouse is required",
                    })}
                  >
                    <option value="">Select a Location...</option>
                    {warehouses?.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} (Cap: {w.capacity})
                      </option>
                    ))}
                  </select>
                )}
                {errors.warehouseId && (
                  <p className="text-xs text-red-500">
                    {errors.warehouseId.message}
                  </p>
                )}
              </div>

              <Input
                label="Product Name"
                placeholder="e.g. Gaming Mouse"
                {...register("name", { required: "Name is required" })}
                error={errors.name?.message}
              />
              <Input
                label="SKU"
                placeholder="e.g. GM-001"
                {...register("sku", { required: "SKU is required" })}
                error={errors.sku?.message}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price", { required: "Required", min: 0 })}
                  error={errors.price?.message}
                />
                <Input
                  label="Quantity"
                  type="number"
                  placeholder="0"
                  {...register("quantity", { required: "Required", min: 1 })}
                  error={errors.quantity?.message}
                />
              </div>

              <Button type="submit" className="w-full" isLoading={isPending}>
                Add to Inventory
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
