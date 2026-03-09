import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white/50 backdrop-blur-md border-r border-[#e6dfce] min-h-[calc(100vh-80px)] p-6 space-y-3 hidden md:block">
      
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 rounded-xl border border-transparent text-sm font-bold transition-all
          ${isActive ? "bg-[#fcedda] border-[#e6dfce] text-[#2b2824] shadow-sm transform scale-105" : "text-[#6e655a] hover:bg-white hover:border-[#e6dfce]"}`
        }
      >
        {assets.add_icon && (
          <img src={assets.add_icon} alt="Add item" className="w-5 h-5 opacity-80" />
        )}
        <span>Add Items</span>
      </NavLink>

      <NavLink
        to="/list"
        className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 rounded-xl border border-transparent text-sm font-bold transition-all
          ${isActive ? "bg-[#fcedda] border-[#e6dfce] text-[#2b2824] shadow-sm transform scale-105" : "text-[#6e655a] hover:bg-white hover:border-[#e6dfce]"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} alt="List items" className="w-5 h-5 opacity-80" />
        )}
        <span>List Items</span>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 rounded-xl border border-transparent text-sm font-bold transition-all
          ${isActive ? "bg-[#fcedda] border-[#e6dfce] text-[#2b2824] shadow-sm transform scale-105" : "text-[#6e655a] hover:bg-white hover:border-[#e6dfce]"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} alt="Orders" className="w-5 h-5 opacity-80" />
        )}
        <span>Orders</span>
      </NavLink>

      <NavLink
        to="/custom-orders"
        className={({ isActive }) =>
          `flex items-center gap-3 px-5 py-3 rounded-xl border border-transparent text-sm font-bold transition-all
          ${isActive ? "bg-[#fcedda] border-[#e6dfce] text-[#2b2824] shadow-sm transform scale-105" : "text-[#6e655a] hover:bg-white hover:border-[#e6dfce]"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} alt="Custom orders" className="w-5 h-5 opacity-80" />
        )}
        <span>Custom Orders</span>
      </NavLink>

    </aside>
  );
};

export default Sidebar;
