import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Customorder from './pages/Customorder'
import Orders from './pages/Orders'
import Placeorder from './pages/Placeorder'
import Product from './pages/Product'
import Profile from "./pages/Profile"
import ShopContextProvider from './context/ShopContext'
import yarnHeroImage from './assets/yarn-hero.jpg' // Add your yarn background image
import About from './pages/About'
import Contact from './pages/Contact'

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <ShopContextProvider>
      <div className="min-h-screen relative">
        
        {/* BACKGROUND IMAGE - ONLY ON HOME PAGE */}
        {isHomePage && (
          <div 
            className="fixed inset-0 bg-cover bg-center -z-10"
            style={{
              backgroundImage: `url(${yarnHeroImage})`,
            }}
          >
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        )}
        
        {/* CONTENT - Padding only on non-home pages */}
        <div className={isHomePage ? "" : "px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/customorder" element={<Customorder />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/placeorder" element={<Placeorder />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        
      </div>
    </ShopContextProvider>
  )
}

export default App