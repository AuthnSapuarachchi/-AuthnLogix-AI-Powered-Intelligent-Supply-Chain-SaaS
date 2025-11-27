import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trackShipmentPublic } from "../../entities/shipment/api/shipmentApi";
import { Button } from "../../shared/ui/Button";
import { Input } from "../../shared/ui/Input";
import { Loader2, Search, PackageCheck } from "lucide-react";
import { MapContainer, TileLayer, Marker,  } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Icon (Same as WarehouseMap)
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const PublicTrackingPage = () => {
  const [searchId, setSearchId] = useState("");
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tracking", trackingId],
    queryFn: () => trackShipmentPublic(trackingId!),
    enabled: !!trackingId, // Only run if ID is set
    retry: false,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId) setTrackingId(searchId);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0"></div>

      <div className="z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            AuthnLogix Track
          </h1>
          <p className="text-gray-400">
            Enter your Shipment ID to track real-time status.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="UUID (e.g. 550e8400-e29b...)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="bg-gray-900/50 border-gray-700"
          />
          <Button type="submit" disabled={!searchId || isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
          </Button>
        </form>

        {isError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center text-sm">
            Shipment not found. Please check the ID.
          </div>
        )}

        {data && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            {/* Status Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {data.productName}
                </h2>
                <p className="text-sm text-gray-400">
                  ID: {data.shipmentId.substring(0, 8)}...
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <PackageCheck size={14} /> {data.status}
              </div>
            </div>

            {/* Map Preview */}
            {data.latitude && data.longitude && (
              <div className="h-48 w-full">
                <MapContainer
                  center={[data.latitude, data.longitude]}
                  zoom={10}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[data.latitude, data.longitude]} />
                </MapContainer>
              </div>
            )}

            {/* Details Grid */}
            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Current Location</p>
                <p className="text-white font-medium">{data.currentLocation}</p>
              </div>
              <div>
                <p className="text-gray-500">Date Shipped</p>
                <p className="text-white font-medium">
                  {new Date(data.shipmentDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
