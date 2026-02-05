import { useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";

const backendUrl = import.meta.env.VITE_BACKENDURL || "http://localhost:9000";

const Add = () => {
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hoops");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !description || !price) {
      alert("Please fill all required fields");
      return;
    }

    if (!images.some((img) => img !== null)) {
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
    <div className="w-full flex justify-center px-4 py-6">
      <form
        onSubmit={submitHandler}
        className="bg-white w-full max-w-3xl p-6 md:p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Add New Product
        </h2>

        {/* IMAGES */}
        <div className="mb-6">
          <p className="mb-3 font-medium">Upload Images</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <label
                key={i}
                className="cursor-pointer flex items-center justify-center"
              >
                <img
                  src={img ? URL.createObjectURL(img) : assets.upload_area}
                  alt={`Upload ${i + 1}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-gray-300 rounded-lg object-cover hover:border-blue-400 transition"
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

        {/* NAME */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Product Name *
          </label>
          <input
            className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Description *
          </label>
          <textarea
            className="border w-full p-3 rounded-lg h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* PRICE + CATEGORY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2 font-medium">
              Price (₹) *
            </label>
            <input
              className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Category
            </label>
            <select
              className="border w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Hoops</option>
              <option>Paintings</option>
              <option>Crochet</option>
              <option>Hair Accessoires</option>
            </select>
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
