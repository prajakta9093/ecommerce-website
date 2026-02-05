import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4 space-y-3">
      
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg border text-sm font-medium transition
          ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }
      >
        {assets.add_icon && (
          <img src={assets.add_icon} alt="Add item" className="w-5 h-5" />
        )}
        <span>Add Items</span>
      </NavLink>

      <NavLink
        to="/list"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg border text-sm font-medium transition
          ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} alt="List items" className="w-5 h-5" />
        )}
        <span>List Items</span>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg border text-sm font-medium transition
          ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} alt="Orders" className="w-5 h-5" />
        )}
        <span>Orders</span>
      </NavLink>

      <NavLink
        to="/custom-orders"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg border text-sm font-medium transition
          ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} alt="Custom orders" className="w-5 h-5" />
        )}
        <span>Custom Orders</span>
      </NavLink>

    </aside>
  );
};

export default Sidebar;
