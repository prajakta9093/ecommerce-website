import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import CustomOrders from "./pages/CustomOrders";

const App = () => {
  const [token, setToken] = useState("");

  // ✅ Load token on refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

  // 🔒 If not logged in → only login page
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/list" element={<List token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            <Route path="/custom-orders" element={<CustomOrders token={token} />} />

            {/* 🚨 Catch-all MUST be last */}
            <Route path="*" element={<Navigate to="/add" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
