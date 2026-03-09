import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setFirstName(res.data.user.profile?.firstName || "");
        setLastName(res.data.user.profile?.lastName || "");
        setPhone(res.data.user.profile?.phone || "");
        setError(null);
      } else {
        setError(res.data.message);
        localStorage.clear();
        navigate("/login");
      }
    } catch {
      setError("Failed to load profile");
      localStorage.clear();
      navigate("/login");
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendUrl}/api/user/profile`,
        { firstName, lastName, phone },
        { headers: { token } }
      );

      if (res.data.success) {
        alert("Profile updated successfully!");
        fetchUserProfile();
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProfile) {
    return (
      <div className="min-h-screen bg-[#faf7f2]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-14 h-14 border-4 border-[#f4c2c2] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#faf7f2]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <button
            onClick={() => navigate("/login")}
            className="btn-primary bg-[#cce3de] text-[#2b2824] px-10 py-4 rounded-full font-bold shadow-soft"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
        {/* Soft Background Accents */}
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#fcedda] rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none translate-x-1/2"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl lg:text-5xl font-['Playfair_Display'] font-bold text-[#2b2824] mb-4">
              My Profile
            </h1>
            <p className="text-[#6e655a] font-medium text-lg">
              Manage your personal details
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-[#e6dfce] overflow-hidden">

            {/* Profile Header */}
            <div className="bg-[#fcedda] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 border-b border-[#e6dfce]">
              <div className="w-24 h-24 bg-white shadow-soft rounded-full flex items-center justify-center text-4xl font-['Playfair_Display'] font-bold text-[#2b2824]">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-[#2b2824] text-center md:text-left">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold mb-1">{user.name}</h2>
                <p className="text-[#6e655a] font-medium">{user.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 md:p-10 space-y-8">
              <form onSubmit={handleUpdate} className="space-y-6">

                {[
                  ["First Name", firstName, setFirstName],
                  ["Last Name", lastName, setLastName],
                  ["Phone Number", phone, setPhone],
                ].map(([label, value, setter]) => (
                  <div key={label}>
                    <label className="block text-sm font-bold text-[#2b2824] mb-2 px-1">
                      {label}
                    </label>
                    <input
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-[#e6dfce] bg-white/50 rounded-xl focus:outline-none focus:border-[#cce3de] transition-colors"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-full font-bold text-lg text-[#2b2824] transition-all shadow-soft duration-300 mt-4 border-2 ${
                    loading
                      ? "bg-[#e2d4e0] border-[#e2d4e0]"
                      : "bg-[#cce3de] border-[#cce3de] hover:bg-[#b0d4cc] hover:border-[#b0d4cc] hover:-translate-y-1 hover:shadow-soft-hover"
                  }`}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>

              {/* Tips */}
              <div className="mt-8 bg-[#faf7f2] p-6 rounded-2xl border border-[#e6dfce] text-sm font-medium text-[#6e655a] flex items-start gap-4">
                <span className="text-[#f4c2c2] text-lg">◆</span>
                <div>
                  <p className="mb-1">Keep your details updated for swift deliveries.</p>
                  <p>Adding a valid phone number ensures you receive accurate order updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
