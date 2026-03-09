import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const List = () => {
  const navigate = useNavigate();
  console.log("Backend URL:", backendUrl);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const res = await axios.post(`${backendUrl}/api/product/remove/${id}`);

      if (res.data.success) {
        alert("✅ Product deleted successfully");
        fetchProducts();
      } else {
        alert("❌ " + res.data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Delete failed (server error)");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 px-4">
        <p className="text-base sm:text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold font-['Playfair_Display'] text-[#2b2824] mb-6 sm:mb-8 flex items-center gap-2">
        <span className="text-[#f4c2c2] text-2xl">◆</span> All Products
      </h2>

      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-[#e6dfce] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm text-left text-[#6e655a]">
            <thead className="bg-[#fcedda]/50 border-b border-[#e6dfce] text-[#2b2824] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4 sm:p-5">Image</th>
                <th className="p-4 sm:p-5">Name</th>
                <th className="p-4 sm:p-5">Category</th>
                <th className="p-4 sm:p-5">Price</th>
                <th className="p-4 sm:p-5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#e6dfce]">
              {products.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-[#faf7f2] transition-colors group"
                >
                  <td className="p-4 sm:p-5">
                    <img
                      src={
                        item.images?.[0]?.startsWith("http")
                          ? item.images[0]
                          : `${backendUrl}/${item.images?.[0]?.replace(/\\/g, "/")}`
                      }
                      alt={item.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl shadow-sm border border-[#e6dfce]"
                      onError={(e) => {
                        console.error("Failed to load:", e.target.src);
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23ddd' width='64' height='64'/%3E%3C/svg%3E";
                      }}
                    />
                  </td>

                  <td className="p-4 sm:p-5 font-bold text-[#2b2824] whitespace-nowrap text-base">
                    {item.name}
                  </td>

                  <td className="p-4 sm:p-5 whitespace-nowrap font-medium">
                    <span className="bg-white px-3 py-1 rounded-full border border-[#e6dfce] shadow-sm text-xs">{item.category}</span>
                  </td>

                  <td className="p-4 sm:p-5 font-bold text-[#2b2824] text-base">
                    ₹{item.price}
                  </td>

                  <td className="p-4 sm:p-5 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/edit/${item._id}`)}
                      className="border border-[#cce3de] bg-white text-[#2b2824] px-4 py-2 rounded-lg hover:bg-[#cce3de]/30 transition-all shadow-sm font-bold text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(item._id)}
                      className="border border-[#f8b4b4]/50 bg-white text-[#b35e5e] px-4 py-2 rounded-lg hover:bg-[#f8b4b4]/20 hover:border-[#f8b4b4] transition-all shadow-sm font-bold text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center mt-6 sm:mt-8 px-4">
            <p className="text-gray-500 text-base sm:text-lg">
              No products found
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Add your first product to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
