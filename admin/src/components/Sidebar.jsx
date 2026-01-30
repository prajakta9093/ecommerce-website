import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-4 space-y-3">
      <NavLink
        to="/add"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md border
           ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }
      >
        {assets.add_icon && (
          <img src={assets.add_icon} className="w-6" />
        )}
        <span>Add Items</span>
      </NavLink>

      <NavLink
        to="/list"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md border
           ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} className="w-6" />
        )}
        <span>List Items</span>
      </NavLink>

      <NavLink
        to="/orders"
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-md border
           ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`
        }
      >
        {assets.order_icon && (
          <img src={assets.order_icon} className="w-6" />
        )}
        <span>Orders</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
