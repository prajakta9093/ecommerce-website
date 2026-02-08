import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Signup") {
        const res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/profile");
        } else {
          alert(res.data.message || "Signup failed");
        }
      } else {
        const res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          navigate("/profile");
        } else {
          alert(res.data.message || "Login failed");
        }
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4]">
      <Navbar />

      <div className="pt-24 pb-16 px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block w-20 h-20 bg-[#8b6f4e] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <h1 className="text-4xl font-bold text-[#3f3a34] mb-2">
              {currentState === "Login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[#7a6f63]">
              {currentState === "Login"
                ? "Sign in to continue"
                : "Join our handmade journey"}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-[#e6e0d6]">
            <form onSubmit={handleSubmit} className="space-y-5">

              {currentState === "Signup" && (
                <div>
                  <label className="block text-sm font-semibold text-[#3f3a34] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-4 border-2 border-[#e6e0d6] rounded-xl focus:outline-none focus:border-[#8b6f4e] focus:ring-4 focus:ring-[#d8cbb8]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#3f3a34] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 border-2 border-[#e6e0d6] rounded-xl focus:outline-none focus:border-[#8b6f4e] focus:ring-4 focus:ring-[#d8cbb8]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3f3a34] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-4 border-2 border-[#e6e0d6] rounded-xl focus:outline-none focus:border-[#8b6f4e] focus:ring-4 focus:ring-[#d8cbb8]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#8b6f4e] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-300 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#755c3f] hover:shadow-xl hover:scale-105"
                }`}
              >
                {loading ? "Please wait..." : currentState}
              </button>

              {/* Toggle */}
              <div className="text-center pt-4">
                <p className="text-[#6b6258]">
                  {currentState === "Login"
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentState(currentState === "Login" ? "Signup" : "Login")
                    }
                    className="text-[#8b6f4e] font-semibold hover:underline"
                  >
                    {currentState === "Login" ? "Sign up" : "Log in"}
                  </button>
                </p>
              </div>

            </form>
          </div>

          <p className="mt-8 text-center text-sm text-[#7a6f63]">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
