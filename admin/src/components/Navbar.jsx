const Navbar = ({ setToken }) => {
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Title */}
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          Admin Panel
        </h1>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full sm:w-auto bg-red-500 text-white px-5 py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
