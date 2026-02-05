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
        console.log("📤 Sending signup request:", { name, email, password });
        
        const res = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        console.log("📥 Signup response:", res.data);

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          console.log("✅ Token saved:", res.data.token);
          console.log("✅ User saved:", res.data.user);
          alert("Signup successful!");
          navigate("/profile");
        } else {
          alert(res.data.message || "Signup failed");
        }
      } else {
        console.log("📤 Sending login request:", { email, password });
        
        const res = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        console.log("📥 Login response:", res.data);

        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          console.log("✅ Token saved:", res.data.token);
          console.log("✅ User saved:", res.data.user);
          alert("Login successful!");
          navigate("/profile");
        } else {
          alert(res.data.message || "Login failed");
        }
      }
    } catch (error) {
      console.error("❌ Error:", error);
      console.error("❌ Error response:", error.response?.data);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 return (
  <>
    <Navbar />

    {/* Page Wrapper */}
    <div className="min-h-screen flex items-start sm:items-center justify-center 
                    px-4 sm:px-6 pt-10 sm:pt-20">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[380px] bg-white 
                   p-5 sm:p-6 
                   shadow-lg rounded-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">
          {currentState}
        </h2>

        {currentState === "Signup" && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border rounded-lg 
                       focus:ring-2 focus:ring-pink-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-lg 
                     focus:ring-2 focus:ring-pink-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-lg 
                     focus:ring-2 focus:ring-pink-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 
                     rounded-lg font-medium 
                     hover:bg-pink-700 
                     disabled:bg-gray-400 transition"
        >
          {loading ? "Please wait..." : currentState}
        </button>

        <p
          className="text-sm text-blue-500 cursor-pointer 
                     text-center hover:underline"
          onClick={() =>
            setCurrentState(
              currentState === "Login" ? "Signup" : "Login"
            )
          }
        >
          {currentState === "Login"
            ? "Create new account"
            : "Already have an account?"}
        </p>
      </form>
    </div>
  </>
);

};

export default Login;