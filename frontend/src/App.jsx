import React from 'react'
import { Route, Routes } from 'react-router-dom'
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

const App = () => {
  return (
    <ShopContextProvider>
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Routes>
          <Route path="/" element={<Home />} />
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
    </ShopContextProvider>
  )
}

export default App
