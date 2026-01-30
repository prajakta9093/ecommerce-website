import { useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

const backendUrl = import.meta.env.VITE_BACKENDURL || "http://localhost:9000";

const Add = () => {
  const [images, setImages] = useState([null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hoops");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!name || !description || !price) {
      alert("Please fill all required fields");
      return;
    }

    if (!images.some(img => img !== null)) {
      alert("Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      images.forEach((img, i) => {
        if (img) formData.append(`image${i + 1}`, img);
      });

      const res = await axios.post(
        backendUrl + "/api/product/add",
        formData
      );

      if (res.data.success) {
        alert("Product added successfully!");
        
        // Reset form
        setImages([null, null, null, null]);
        setName("");
        setDescription("");
        setPrice("");
        setCategory("Hoops");
      } else {
        alert(res.data.message || "Failed to add product");
      }
    } catch (error) {
      console.log(error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submitHandler} className="bg-white p-6 rounded shadow-md max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>

      <div className="mb-6">
        <p className="mb-3 font-medium">Upload Images</p>
        <div className="flex gap-3 flex-wrap">
          {images.map((img, i) => (
            <label key={i} className="cursor-pointer">
              <img
                src={img ? URL.createObjectURL(img) : assets.upload_area}
                alt={`Upload ${i + 1}`}
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded object-cover hover:border-blue-400 transition"
              />
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const arr = [...images];
                  arr[i] = e.target.files[0];
                  setImages(arr);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Product Name *</label>
        <input
          className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Description *</label>
        <textarea
          className="border w-full p-2 rounded h-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Price (₹) *</label>
        <input
          className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter price"
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Category</label>
        <select
          className="border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Hoops</option>
          <option>Paintings</option>
          <option>Crochet</option>
          <option>Hair Accessoires</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
      >
        {loading ? "Adding Product..." : "Add Product"}
      </button>
    </form>
  );
};

export default Add;