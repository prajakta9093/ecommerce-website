import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const currency = "₹";
  const delivery_fee = 1;
  const backendUrl = import.meta.env.VITE_BACKENDURL; 

  const [products, setProducts] = useState([]);
  const [cartitems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from local storage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  /* ---------- FETCH PRODUCTS ---------- */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      console.log("Fetched products:", res.data);
      
      if (res.data.success) {
        setProducts(res.data.products || []);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ---------- REFRESH PRODUCTS ---------- */
  const refreshProducts = async () => {
    await fetchProducts();
  };

  /* ---------- ADD TO CART ---------- */
  const addToCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };

      if (!updated[itemId]) {
        updated[itemId] = { quantity: 1 };
      } else {
        updated[itemId].quantity += 1;
      }

      return updated;
    });
  };

  /* ---------- REMOVE ITEM ---------- */
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    });
  };

  /* ---------- UPDATE QUANTITY ---------- */
  const updateQuantity = (itemId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [itemId]: { quantity },
    }));
  };

  /* ---------- TOTAL AMOUNT ---------- */
  const getCartAmount = () => {
    let total = 0;

    for (const itemId in cartitems) {
      const product = products.find(
        (p) => String(p._id) === String(itemId)
      );
      if (product) {
        total += product.price * cartitems[itemId].quantity;
      }
    }
    return total;
  };

  /* ---------- TOTAL ITEMS ---------- */
  const getCartCount = () => {
    let count = 0;
    for (const itemId in cartitems) {
      count += cartitems[itemId].quantity;
    }
    return count;
  };

  /* ---------- CLEAR CART ---------- */
  const clearCart = () => {
    setCartItems({});
  };

  /* ---------- WISHLIST ---------- */
  const toggleWishlist = (productId) => {
    setWishlist((prev) => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const value = {
    products,
    cartitems,
    wishlist,
    search, setSearch,
    showSearch, setShowSearch,
    currency,
    delivery_fee,
    backendUrl, // Export this so other components can use it
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartAmount,
    getCartCount,
    clearCart,
    refreshProducts,
    toggleWishlist,
    isInWishlist,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;