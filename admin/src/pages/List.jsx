import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKENDURL;

const List = () => {
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
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-6">All Products</h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Image</th>
              <th className="border p-3">Name</th>
              <th className="border p-3">Category</th>
              <th className="border p-3">Price</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((item) => (
              <tr key={item._id} className="text-center hover:bg-gray-50">
                <td className="border p-3">
                  <img
                    src={
                      item.images?.[0]?.startsWith('http')
                        ? item.images[0]
                        : `${backendUrl}/${item.images?.[0]?.replace(/\\/g, "/")}`
                    }
                    alt={item.name}
                    className="w-16 h-16 object-cover mx-auto rounded"
                    onError={(e) => {
                      console.error("Failed to load:", e.target.src);
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23ddd' width='64' height='64'/%3E%3C/svg%3E";
                    }}
                  />
                </td>

                <td className="border p-3 font-medium">{item.name}</td>
                <td className="border p-3">{item.category}</td>
                <td className="border p-3 font-semibold">₹{item.price}</td>

                <td className="border p-3">
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-500 text-lg">No products found</p>
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