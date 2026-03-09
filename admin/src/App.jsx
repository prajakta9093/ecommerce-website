import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Add from "./pages/Add";
import Edit from "./pages/Edit";
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

  // 🔒 If not logged in → only login page
  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar setToken={setToken} />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 relative overflow-hidden">
           {/* Soft Background Accents */}
           <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#fcedda] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none translate-x-1/2 -z-10"></div>
           <div className="absolute bottom-10 left-0 w-[400px] h-[400px] bg-[#e2d4e0] rounded-full blur-[100px] opacity-30 mix-blend-multiply pointer-events-none -translate-x-1/2 -z-10"></div>

          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route path="/edit/:id" element={<Edit token={token} />} />
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