import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Warehouse } from "../../entities/warehouse/model/types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for missing Leaflet marker icons in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WarehouseMapProps {
  warehouses: Warehouse[];
}

export const WarehouseMap = ({ warehouses }: WarehouseMapProps) => {
  // Center map on Sri Lanka (approx)
  const position: [number, number] = [7.8731, 80.7718];

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border border-gray-800 z-0">
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {warehouses.map(
          (wh) =>
            // Only render if coords exist
            wh.latitude &&
            wh.longitude && (
              <Marker key={wh.id} position={[wh.latitude, wh.longitude]}>
                <Popup>
                  <div className="text-black font-sans">
                    <strong>{wh.name}</strong>
                    <br />
                    {wh.location}
                    <br />
                    Cap: {wh.capacity}
                  </div>
                </Popup>
              </Marker>
            )
        )}
      </MapContainer>
    </div>
  );
};
