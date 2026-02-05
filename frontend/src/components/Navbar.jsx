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
    <header className="bg-pink-200 shadow-md w-full">
      <div className="flex items-center justify-between px-4 py-4 flex-wrap">

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16 rounded-full border-2 border-pink-400 object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-pink-600" : "hover:text-pink-600"}>
            HOME
          </NavLink>
          <NavLink to="/Shop" className={({ isActive }) => isActive ? "text-pink-600" : "hover:text-pink-600"}>
            SHOP
          </NavLink>
          <NavLink to="/Customorder" className={({ isActive }) => isActive ? "text-pink-600" : "hover:text-pink-600"}>
            CUSTOM ORDER
          </NavLink>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <img
              src={profile_icon}
              className="w-5 cursor-pointer"
              alt="profile"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />

            {dropdownOpen && (
              <div className="absolute right-0 mt-3 bg-white shadow-lg rounded-md py-3 px-4 flex flex-col gap-2 w-40 text-sm z-50">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => handleNavClick("/profile")} className="text-left hover:text-pink-500">
                      My Profile
                    </button>
                    <button onClick={() => handleNavClick("/orders")} className="text-left hover:text-pink-500">
                      Orders
                    </button>
                    <hr />
                    <button onClick={handleLogout} className="text-left text-red-500 font-medium">
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleNavClick("/login")} className="text-left hover:text-pink-500">
                    Login
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/Cart" className="relative">
            <img src={cart_icon} className="w-5" alt="cart" />
            {getCartCount() > 0 && (
              <span className="absolute -right-2 -bottom-2 w-4 h-4 bg-pink-600 text-white text-[10px] flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden bg-pink-100 px-6 py-4">
          <ul className="flex flex-col gap-4 text-sm font-medium text-gray-700">
            <li onClick={() => handleNavClick("/")}>HOME</li>
            <li onClick={() => handleNavClick("/Shop")}>SHOP</li>
            <li onClick={() => handleNavClick("/Customorder")}>CUSTOM ORDER</li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
