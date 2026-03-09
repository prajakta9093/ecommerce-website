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

    try {
      const res = await fetch(`${backendUrl}/api/user/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem("adminToken", data.token);
        setToken(data.token);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#faf7f2] relative overflow-hidden">
       {/* Background Accents */}
       <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-[#f4c2c2] rounded-full blur-[100px] opacity-30 mix-blend-multiply pointer-events-none"></div>
       <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#cce3de] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

      <div className="bg-white/90 backdrop-blur-sm w-full max-w-md p-8 sm:p-10 rounded-3xl shadow-soft border border-[#e6dfce] relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-[#fcedda] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-white">
            <svg
              className="w-8 h-8 text-[#2b2824]"
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

          <h1 className="text-3xl font-['Playfair_Display'] font-bold text-[#2b2824]">
            Store Admin
          </h1>
          <p className="text-base font-medium text-[#6e655a] mt-2">
            Sign in to manage YarnYapper
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#2b2824] mb-2 px-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 border-2 border-[#e6dfce] bg-white/50 rounded-xl focus:outline-none focus:border-[#cce3de] transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#2b2824] mb-2 px-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin(e)}
              className="w-full px-5 py-4 border-2 border-[#e6dfce] bg-white/50 rounded-xl focus:outline-none focus:border-[#cce3de] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-4 rounded-full font-bold text-lg text-[#2b2824] transition-all shadow-soft mt-6 border-2 ${
              loading
                ? "bg-[#e2d4e0] border-[#e2d4e0]"
                : "bg-[#cce3de] border-[#cce3de] hover:bg-[#b0d4cc] hover:border-[#b0d4cc] hover:-translate-y-1"
            }`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </div>

        {/* Demo credentials */}
        <div className="mt-8 p-5 bg-[#faf7f2] rounded-2xl border border-[#e6dfce] text-sm font-medium text-[#6e655a]">
          <p className="font-bold text-[#2b2824] mb-2 flex items-center gap-2">
            <span className="text-[#f4c2c2] text-lg">◆</span> Demo Credentials
          </p>
          <div className="space-y-1 ml-5">
            <p>Email: vid@gmail.com</p>
            <p>Password: 12345678</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
