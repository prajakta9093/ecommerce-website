import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "lucide-react";

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
    <div className="flex flex-col min-h-screen bg-[#faf7f2]">
      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#d6e2e9] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#fcedda] rounded-full blur-[100px] opacity-30 mix-blend-multiply pointer-events-none translate-x-1/3 translate-y-1/3"></div>

        <div className="w-full max-w-md relative z-10">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 text-[#d6e2e9] shadow-sm border border-[#e6dfce]">
               <User size={36} strokeWidth={2.5} className="text-[#2b2824]" />
            </div>

            <h1 className="text-4xl font-['Playfair_Display'] font-bold text-[#2b2824] mb-3">
              {currentState === "Login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-[#6e655a] font-medium text-lg">
              {currentState === "Login"
                ? "Sign in to access your curated collection"
                : "Join our community of craft lovers"}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm p-8 sm:p-10 border border-[#e6dfce]">
            <form onSubmit={handleSubmit} className="space-y-6">

              {currentState === "Signup" && (
                <div>
                  <label className="block text-sm font-bold text-[#6e655a] mb-2 px-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 bg-white border border-[#e6dfce] rounded-xl focus:outline-none focus:border-[#d6e2e9] focus:ring-4 focus:ring-[#d6e2e9]/20 transition-all text-[#2b2824] placeholder:text-[#a39a90] font-medium shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#6e655a] mb-2 px-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 bg-white border border-[#e6dfce] rounded-xl focus:outline-none focus:border-[#d6e2e9] focus:ring-4 focus:ring-[#d6e2e9]/20 transition-all text-[#2b2824] placeholder:text-[#a39a90] font-medium shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                 <div className="flex justify-between items-center mb-2 px-1">
                    <label className="block text-sm font-bold text-[#6e655a]">
                      Password
                    </label>
                    {currentState === "Login" && (
                      <button type="button" className="text-xs font-bold text-[#a39a90] hover:text-[#d6e2e9] transition-colors">
                        Forgot Password?
                      </button>
                    )}
                 </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-white border border-[#e6dfce] rounded-xl focus:outline-none focus:border-[#d6e2e9] focus:ring-4 focus:ring-[#d6e2e9]/20 transition-all text-[#2b2824] placeholder:text-[#a39a90] font-medium shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 mt-2 rounded-xl font-bold text-lg transition-all shadow-soft border-2 text-[#2b2824] ${
                  loading
                    ? "bg-[#e6dfce] opacity-70 cursor-not-allowed shadow-none border-[#e6dfce]"
                    : "bg-[#d6e2e9] hover:bg-[#c2d3dd] hover:shadow-soft-hover border-[#d6e2e9] hover:border-[#c2d3dd] hover:-translate-y-0.5"
                }`}
              >
                {loading ? "Processing..." : currentState}
              </button>

              {/* Toggle State */}
              <div className="text-center pt-2">
                <p className="text-[#6e655a] font-medium text-sm">
                  {currentState === "Login"
                    ? "New to our store? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentState(currentState === "Login" ? "Signup" : "Login")
                    }
                    className="text-[#2b2824] font-bold hover:text-[#d6e2e9] transition-colors underline decoration-2 underline-offset-4"
                  >
                    {currentState === "Login" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </div>

            </form>
          </div>

          <p className="mt-8 text-center text-xs text-[#a39a90] font-medium">
            By continuing, you agree to our <a href="#" className="underline hover:text-[#6e655a]">Terms of Service</a> and <a href="#" className="underline hover:text-[#6e655a]">Privacy Policy</a>.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
