import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";

const App = () => {
  const [token, setToken] = useState(""); // Start with no token

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

  // If no token, show login page ONLY
  if (!token) {
    return <Login setToken={setToken} />;
  }

  // If token exists, show admin dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setToken={setToken} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Orders onLogout={handleLogout} token={token} />} />
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;