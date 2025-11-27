import { LoginForm } from "./shared/ui/LoginForm";
import "./index.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { useAuthStore } from "./entities/session/model/authStore";
import { WarehousePage } from "./pages/warehouse/WarehousePage";
import { ProductPage } from "./pages/product/ProductPage";
import { ShipmentPage } from "./pages/shipment/ShipmentPage";
import { AuditPage } from "./pages/audit/AuditPage";
import { PublicTrackingPage } from "./pages/tracking/PublicTrackingPage";
import { SubscriptionPage } from "./pages/subscription/SubscriptionPage";
import { Toaster } from "sonner";

// 1. Create a Guard Wrapper
// If user is NOT logged in, kick them back to Login page
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route
          path="/"
          element={
            <div className="flex items-center justify-center min-h-screen bg-black">
              <LoginForm />
            </div>
          }
        />
        <Route path="/track" element={<PublicTrackingPage />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute>
              <WarehousePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shipments"
          element={
            <ProtectedRoute>
              <ShipmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <ProtectedRoute>
              <AuditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscribe"
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
