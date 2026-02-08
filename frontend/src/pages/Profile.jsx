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
      <div className="min-h-screen bg-[#f6f1eb]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-14 h-14 border-4 border-[#a8744c] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#f6f1eb]">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#a8744c] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#8f623f]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f1eb]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <h1 className="text-4xl font-bold text-[#6b3e2e] mb-2">
            My Profile
          </h1>
          <p className="text-[#7a5c48] mb-8">
            Manage your account information
          </p>

          <div className="bg-[#fffaf5] rounded-3xl shadow-xl overflow-hidden">

            {/* Profile Header */}
            <div className="bg-[#a8744c] p-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-[#fffaf5] rounded-full flex items-center justify-center text-4xl font-bold text-[#a8744c]">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-white/90">{user.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 space-y-6">
              <form onSubmit={handleUpdate} className="space-y-5">

                {[
                  ["First Name", firstName, setFirstName],
                  ["Last Name", lastName, setLastName],
                  ["Phone Number", phone, setPhone],
                ].map(([label, value, setter]) => (
                  <div key={label}>
                    <label className="block text-sm font-semibold text-[#6b3e2e] mb-2">
                      {label}
                    </label>
                    <input
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                      className="w-full px-5 py-4 border-2 border-[#e6dccf] rounded-xl focus:outline-none focus:border-[#a8744c]"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-bold text-lg text-white transition ${
                    loading
                      ? "bg-[#cbb29b]"
                      : "bg-[#a8744c] hover:bg-[#8f623f]"
                  }`}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>

              {/* Tips */}
              <div className="mt-6 bg-[#f3ebe2] p-6 rounded-2xl text-sm text-[#6b3e2e]">
                <p>• Keep your details updated for smooth deliveries</p>
                <p>• Phone number helps with order updates</p>
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
