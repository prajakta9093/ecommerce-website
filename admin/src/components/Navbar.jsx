const Navbar = ({ setToken }) => {
  const logout = () => {
    localStorage.removeItem("adminToken");
    setToken("");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between">
      <h1 className="font-bold">Admin Panel</h1>
      <button onClick={logout} className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
};

export default Navbar;