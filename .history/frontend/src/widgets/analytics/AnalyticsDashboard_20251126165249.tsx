import { useAnalytics } from "../../entities/analytics/model/useAnalytics";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Loader2, DollarSign, Package, AlertTriangle } from "lucide-react";

// Chart Colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export const AnalyticsDashboard = () => {
  const { data, isLoading } = useAnalytics();

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      
      {/* 1. KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Value Card */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Inventory Value</p>
            <h3 className="text-2xl font-bold text-white">${data.totalInventoryValue.toLocaleString()}</h3>
          </div>
        </div>

        {/* Total Products Card */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 rounded-full text-green-500">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Items</p>
            <h3 className="text-2xl font-bold text-white">{data.totalProducts}</h3>
          </div>
        </div>

        {/* Low Stock Card */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 rounded-full text-red-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Low Stock Alerts</p>
            <h3 className="text-2xl font-bold text-white">{data.lowStockItems}</h3>
          </div>
        </div>
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Distribution Bar Chart */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-[3px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Distribution by Warehouse</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.warehouseDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="warehouseName" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} 
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="productCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie Chart */}
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-[300px]">
          <h3 className="text-lg font-semibold mb-4 text-gray-200">Stock Share</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.warehouseDistribution as unknown as any}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="productCount"
              >
                {data.warehouseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};