import React from "react";
import LoginForm from "./features/auth/components/LoginForm";
import "./index.css";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <LoginForm />
    </div>
  );
}

export default App;
