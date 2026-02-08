import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import profile_icon from "../assets/profile_icon.png";
import cart_icon from "../assets/cart_icon.png";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { getCartCount } = useContext(ShopContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleNavClick = (path) => {
    setMobileMenu(false);
    navigate(path);
  };

  return (
    <header className="bg-[#6F4E37] w-full shadow-md border-b border-[#5A3A26]">
      <div className="flex items-center justify-between px-4 py-4 flex-wrap">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 rounded-full border-2 border-[#FAF6F1] object-contain bg-white"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-[#FAF6F1]">
          {["/", "/Shop", "/Customorder", "/About", "/Contact"].map((path, i) => (
            <NavLink
              key={i}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold underline underline-offset-4"
                  : "hover:text-[#E6D8C9] transition"
              }
            >
              {["HOME", "SHOP", "CUSTOM ORDER", "ABOUT US", "CONTACT"][i]}
            </NavLink>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-[#FAF6F1]"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profile_icon}
              alt="profile"
              className="w-5 cursor-pointer filter invert brightness-0 hover:opacity-80 transition"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 bg-[#FAF6F1] shadow-lg rounded-md py-3 px-4 flex flex-col gap-2 w-40 text-sm z-50 text-[#5A3A26]">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => handleNavClick("/profile")}
                      className="text-left hover:text-[#6F4E37]"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => handleNavClick("/orders")}
                      className="text-left hover:text-[#6F4E37]"
                    >
                      Orders
                    </button>
                    <hr className="border-[#E6D8C9]" />
                    <button
                      onClick={handleLogout}
                      className="text-left text-[#6F4E37] font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavClick("/login")}
                    className="text-left hover:text-[#6F4E37]"
                  >
                    Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/Cart" className="relative">
            <img
              src={cart_icon}
              alt="cart"
              className="w-5 filter invert brightness-0 hover:opacity-80 transition"
            />
            {getCartCount() > 0 && (
              <span className="absolute -right-2 -bottom-2 w-4 h-4 bg-[#FAF6F1] text-[#6F4E37] text-[10px] flex items-center justify-center rounded-full font-bold">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-[#5A3A26] px-6 py-4 border-t border-[#4A2F20]">
          <ul className="flex flex-col gap-4 text-sm font-medium text-[#FAF6F1]">
            <li onClick={() => handleNavClick("/")} className="hover:text-[#E6D8C9] cursor-pointer">HOME</li>
            <li onClick={() => handleNavClick("/Shop")} className="hover:text-[#E6D8C9] cursor-pointer">SHOP</li>
            <li onClick={() => handleNavClick("/Customorder")} className="hover:text-[#E6D8C9] cursor-pointer">CUSTOM ORDER</li>
            <li onClick={() => handleNavClick("/About")} className="hover:text-[#E6D8C9] cursor-pointer">ABOUT</li>
            <li onClick={() => handleNavClick("/Contact")} className="hover:text-[#E6D8C9] cursor-pointer">CONTACT</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
