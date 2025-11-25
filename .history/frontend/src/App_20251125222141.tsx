import React from "react";  

import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-8 p-4">
      <div className="space-y-4 text-center">
        <h1 className="text-3xl font-bold">UI Component Check</h1>
        <p className="text-gray-400">
          If these look good, our Design System is ready.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6 p-8 bg-gray-900 rounded-xl border border-gray-800">
        {/* Input Test */}
        <div className="space-y-4">
          <Input label="Email Address" placeholder="user@example.com" />
          <Input
            label="Password"
            type="password"
            error="Incorrect password test"
          />
        </div>

        {/* Button Test */}
        <div className="flex flex-col gap-3">
          <Button>Primary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="destructive" isLoading>
            Loading State
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
