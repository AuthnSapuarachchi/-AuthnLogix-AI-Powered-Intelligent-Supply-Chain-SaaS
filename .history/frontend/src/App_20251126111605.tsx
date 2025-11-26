import { LoginForm } from "./shared/ui/LoginForm";
import "./index.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { useAuthStore } from "./entities/session/model/authStore";
import { WarehousePage } from "./pages/warehouse/WarehousePage";
import { ProductPage } from "./pages/product/ProductPage";

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
        <Route path="/products" element={ <ProtectedRoute><ProductPage /></ProtectedRoute> } />
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
