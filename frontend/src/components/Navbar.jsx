import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import search_icon from '../assets/search_icon.png';
import profile_icon from '../assets/profile_icon.png';
import cart_icon from '../assets/cart_icon.png';
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const { getCartCount } = useContext(ShopContext);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Close dropdown if clicking outside
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setDropdownOpen(false);
    alert("Logged out successfully!");
    navigate("/login");
  };

  const handleProfileClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className='flex items-center justify-between py-5 font-medium px-6 bg-pink-200 shadow-md'>
      
      {/* Logo */}
      <Link to="/">
        <img 
          src={logo} 
          alt="logo" 
          className='w-[70px] h-[70px] object-contain rounded-full border-2 border-pink-400 hover:scale-105 transition' 
        />
      </Link>

      {/* Nav Menu */}
      <ul className='flex gap-8 text-sm text-gray-700'>
        <NavLink 
          to="/" 
          className={({isActive}) => isActive ? "text-pink-600 font-semibold" : "hover:text-pink-600 transition"}
        >
          HOME
        </NavLink>
        <NavLink 
          to="/Shop" 
          className={({isActive}) => isActive ? "text-pink-600 font-semibold" : "hover:text-pink-600 transition"}
        >
          SHOP
        </NavLink>
        <NavLink 
          to="/Customorder" 
          className={({isActive}) => isActive ? "text-pink-600 font-semibold" : "hover:text-pink-600 transition"}
        >
          CUSTOM ORDER
        </NavLink>
      </ul>

      {/* Right Icons */}
      <div className='flex items-center gap-6'>
        
      

        {/* Profile Dropdown */}
        <div className='relative' ref={dropdownRef}>
          <img
            src={profile_icon}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className='w-5 cursor-pointer hover:scale-110 transition'
            alt="profile"
          />

          {dropdownOpen && (
            <div className='absolute right-0 mt-3 bg-white shadow-lg rounded-md py-3 px-5 flex flex-col gap-2 w-40 text-gray-600 z-50'>
              {isLoggedIn ? (
                <>
                  <button 
                    onClick={() => handleProfileClick('/profile')} 
                    className='text-left hover:text-pink-500 transition'
                  >
                    My Profile
                  </button>
                  <button 
                    onClick={() => handleProfileClick('/orders')} 
                    className='text-left hover:text-pink-500 transition'
                  >
                    Orders
                  </button>
                  <hr className='border-gray-200' />
                  <button 
                    onClick={handleLogout} 
                    className='text-left hover:text-red-500 transition font-medium'
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleProfileClick('/login')} 
                  className='text-left hover:text-pink-500 transition'
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to='/Cart' className='relative'>
          <img 
            src={cart_icon} 
            className='w-5 hover:scale-110 transition' 
            alt="cart"
          />
          {getCartCount() > 0 && (
            <span className='absolute right-[-5px] bottom-[-5px] w-4 h-4 bg-pink-600 text-white flex items-center justify-center text-[9px] rounded-full'>
              {getCartCount()}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
};

export default Navbar;