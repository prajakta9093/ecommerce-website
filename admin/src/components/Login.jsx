import { useState } from "react";

const backendUrl = import.meta.env.VITE_BACKENDURL; 

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔄 Attempting login...", { email, backendUrl });

    try {
      console.log("📤 Sending request to:", `${backendUrl}/api/user/admin-login`);
      
      const res = await fetch(`${backendUrl}/api/user/admin-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("📡 Response received:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        headers: Object.fromEntries(res.headers.entries())
      });

      if (!res.ok) {
        console.error("❌ Response not OK:", res.status);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text();
        console.error("❌ Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const data = await res.json();
      console.log("📦 Response data:", data);

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        console.log("✅ Login successful, token stored:", data.token.substring(0, 20) + "...");
        setToken(data.token); // Update parent state
      } else {
        console.log("❌ Login failed:", data.message);
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      setError(`Connection error: ${error.message}. Please ensure backend is running on http://localhost:9000`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Sign in to manage your store</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <p className="text-xs font-semibold text-gray-700 mb-2">Demo Credentials</p>
          <p className="text-xs text-gray-600">Email: vid@gmail.com</p>
          <p className="text-xs text-gray-600">Password: 12345678</p>
        </div>
      </div>
    </div>
  );
};

export default Login;