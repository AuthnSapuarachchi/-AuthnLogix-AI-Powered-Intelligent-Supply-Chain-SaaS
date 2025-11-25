import { LoginForm } from "./shared/ui/LoginForm";
import "./index.css";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
