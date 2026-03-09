import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Heart, Search } from "lucide-react";
import logo from "../assets/logo.jpeg";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { getCartCount, wishlist, search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Check scroll for shadow
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  
  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch && location.pathname !== '/Shop') {
      navigate('/Shop');
    }
  };

  return (
    <>
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-[#e6dfce] border-b border-[#e6dfce] shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Mobile Menu Button (Left on mobile) */}
        <button
          className="md:hidden text-[#2b2824] hover:text-[#f4c2c2] transition-colors"
          onClick={() => setMobileMenu(true)}
        >
          <Menu size={24} />
        </button>

        {/* Logo (Center on mobile, Left on desktop) */}
        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-3 group relative">
            <span className="text-2xl font-bold tracking-wide text-[#2b2824] font-['Playfair_Display'] relative z-10">
              YarnYapper
            </span>
            <div className="absolute -bottom-1 -right-2 w-6 h-6 bg-[#fcedda] rounded-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-10 items-center">
          {["/", "/Shop", "/Customorder", "/About", "/Contact"].map((path, i) => {
            const labels = ["Home", "Shop", "Custom Order", "Our Story", "Contact"];
            return (
              <NavLink
                key={i}
                to={path}
                className={({ isActive }) =>
                  `text-[15px] font-semibold transition-all duration-300 relative group pb-1 ${
                    isActive ? "text-[#2b2824]" : "text-[#6e655a] hover:text-[#2b2824]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {labels[i]}
                    {/* Elegant animated underline - alternating colors */}
                    <span className={`absolute left-0 bottom-0 h-[3px] rounded-full transition-all duration-300 
                      ${i % 2 === 0 ? 'bg-[#f4c2c2]' : 'bg-[#cce3de]'}
                      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Search Icon */}
          <button 
            onClick={handleSearchToggle}
            className="text-[#2b2824] hover:text-[#cce3de] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-white shadow-none hover:shadow-soft"
          >
            <Search size={22} strokeWidth={2} />
          </button>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="text-[#2b2824] hover:text-[#d6e2e9] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-white shadow-none hover:shadow-soft"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User size={22} strokeWidth={2} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-4 bg-white shadow-soft hover rounded-2xl py-3 px-2 flex flex-col w-48 text-[15px] z-50 border border-[#e2d4e0]">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => handleNavClick("/profile")} className="text-left hover:bg-[#cce3de]/30 px-4 py-2 rounded-lg text-[#2b2824] transition-colors font-medium">
                      My Profile
                    </button>
                    <button onClick={() => handleNavClick("/orders")} className="text-left hover:bg-[#cce3de]/30 px-4 py-2 rounded-lg text-[#2b2824] transition-colors font-medium">
                      Order History
                    </button>
                    <div className="h-[1px] bg-[#e6dfce] my-1 mx-2"></div>
                    <button onClick={handleLogout} className="text-left hover:bg-[#f4c2c2]/40 text-[#b35e5e] px-4 py-2 rounded-lg transition-colors font-medium">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleNavClick("/login")} className="text-left hover:bg-[#d6e2e9]/40 px-4 py-2 rounded-lg text-[#2b2824] font-semibold transition-colors">
                      Sign In
                    </button>
                    <button onClick={() => handleNavClick("/login")} className="text-left hover:bg-[#d6e2e9]/40 px-4 py-2 rounded-lg text-[#6e655a] font-medium transition-colors">
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Wishlist */}
          <Link to="/wishlist" className="relative hidden sm:flex text-[#2b2824] hover:text-[#f8b4b4] transition-colors items-center justify-center p-2 rounded-full hover:bg-white shadow-none hover:shadow-soft">
            <Heart size={22} strokeWidth={2} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-[20px] h-[20px] bg-[#f8b4b4] text-[#2b2824] text-[11px] flex items-center justify-center rounded-full font-bold shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/Cart" className="relative text-[#2b2824] hover:text-[#f4c2c2] transition-colors flex items-center justify-center p-2 rounded-full hover:bg-white shadow-none hover:shadow-soft">
            <ShoppingBag size={22} strokeWidth={2} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-[20px] h-[20px] bg-[#f4c2c2] text-[#2b2824] text-[11px] flex items-center justify-center rounded-full font-bold shadow-sm">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      {/* Search Bar Dropdown */}
      <div className={`w-full bg-white shadow-soft transition-all duration-300 overflow-hidden ${showSearch ? 'max-h-24 py-4 border-t border-[#e6dfce]' : 'max-h-0 py-0'}`}>
        <div className="max-w-3xl mx-auto px-6 flex items-center gap-3">
          <Search size={20} className="text-[#6e655a]" />
          <input 
            type="text" 
            placeholder="Search curations..." 
            className="w-full bg-transparent outline-none text-[#2b2824] font-medium text-lg placeholder:text-[#a39a90]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus={showSearch}
          />
          <button onClick={() => setShowSearch(false)} className="text-[#6e655a] hover:text-[#b35e5e] p-1">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-[#2b2824]/30 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${mobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenu(false)}
      >
        <div 
          className={`fixed top-0 left-0 h-full w-[280px] bg-[#faf7f2] shadow-soft transition-transform duration-300 ease-in-out px-6 py-8 flex flex-col ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-[#e6dfce]">
            <span className="text-2xl font-bold tracking-wide text-[#2b2824] font-['Playfair_Display']">
              YarnYapper
            </span>
            <button onClick={() => setMobileMenu(false)} className="text-[#6e655a] hover:text-[#f4c2c2] transition-colors bg-white p-2 rounded-full shadow-sm">
              <X size={20} className="stroke-[2.5]" />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {["/", "/Shop", "/Customorder", "/About", "/Contact", "/wishlist"].map((path, i) => {
              const labels = ["Home", "Shop", "Custom Order", "Our Story", "Contact", "Wishlist"];
              const bgColors = ["hover:bg-[#f4c2c2]/20", "hover:bg-[#cce3de]/20", "hover:bg-[#d6e2e9]/20", "hover:bg-[#e2d4e0]/20", "hover:bg-[#fcedda]/40", "hover:bg-[#f8b4b4]/20"];
              return (
                <NavLink
                  key={i}
                  to={path}
                  onClick={() => setMobileMenu(false)}
                  className={({ isActive }) =>
                    `text-lg font-semibold transition-all px-4 py-3 rounded-2xl flex justify-between items-center ${
                      isActive ? "bg-white shadow-sm text-[#2b2824]" : `text-[#6e655a] ${bgColors[i]}`
                    }`
                  }
                >
                  {labels[i]}
                  {labels[i] === "Wishlist" && wishlist.length > 0 && (
                     <span className="bg-[#f8b4b4] text-[#2b2824] text-xs px-2 py-0.5 rounded-full font-bold">{wishlist.length}</span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
    </>
  );
};

export default Navbar;
