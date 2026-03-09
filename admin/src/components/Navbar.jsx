const Navbar = ({ setToken }) => {
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm shadow-soft border-b border-[#e6dfce] px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-[#2b2824] font-['Playfair_Display'] flex items-center gap-2">
          YarnYapper <span className="text-[#f4c2c2] text-sm hidden sm:inline">◆</span> <span className="text-[#6e655a] font-medium text-lg hidden sm:inline">Admin</span>
        </h1>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full sm:w-auto bg-[#fcedda] hover:bg-[#ffe1b8] text-[#2b2824] border border-[#e6dfce] px-6 py-2.5 rounded-full text-sm sm:text-base font-bold transition-all shadow-sm hover:shadow-soft-hover"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
