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
        className="bg-white/80 backdrop-blur-sm w-full max-w-3xl p-8 md:p-10 rounded-3xl shadow-soft border border-[#e6dfce]"
      >
        <h2 className="text-3xl font-bold font-['Playfair_Display'] mb-8 text-[#2b2824] flex items-center gap-2">
           <span className="text-[#cce3de] text-2xl">◆</span> Add New Product
        </h2>

        {/* IMAGES */}
        <div className="mb-6">
          <p className="mb-3 font-medium">Upload Images</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <label
                key={i}
                className="cursor-pointer flex items-center justify-center group"
              >
                <img
                  src={img ? URL.createObjectURL(img) : assets.upload_area}
                  alt={`Upload ${i + 1}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 border-2 border-dashed border-[#e6dfce] bg-white/50 rounded-2xl object-cover group-hover:border-[#cce3de] group-hover:shadow-sm transition-all"
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
        <div className="mb-5">
          <label className="block mb-2 font-bold text-[#2b2824] px-1">
            Product Name <span className="text-[#f4c2c2]">*</span>
          </label>
          <input
            className="w-full px-5 py-4 border-2 border-[#e6dfce] bg-white/50 rounded-xl focus:outline-none focus:border-[#cce3de] transition-colors"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-5">
          <label className="block mb-2 font-bold text-[#2b2824] px-1">
            Description <span className="text-[#f4c2c2]">*</span>
          </label>
          <textarea
            className="w-full px-5 py-4 border-2 border-[#e6dfce] bg-white/50 rounded-xl focus:outline-none focus:border-[#cce3de] transition-colors h-32 resize-none"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* PRICE + CATEGORY */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div>
            <label className="block mb-2 font-bold text-[#2b2824] px-1">
              Price (₹) <span className="text-[#f4c2c2]">*</span>
            </label>
            <input
              className="w-full px-5 py-4 border-2 border-[#e6dfce] bg-white/50 rounded-xl focus:outline-none focus:border-[#cce3de] transition-colors"
              placeholder="Enter price"
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-[#2b2824] px-1">
              Category
            </label>
            <select
              className="w-full px-5 py-4 border-2 border-[#e6dfce] bg-white/50 rounded-xl focus:outline-none focus:border-[#cce3de] transition-colors appearance-none cursor-pointer"
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
          className={`w-full py-4 rounded-full font-bold text-lg text-[#2b2824] transition-all shadow-soft border-2 mt-2 ${
            loading
              ? "bg-[#e2d4e0] border-[#e2d4e0] cursor-not-allowed"
              : "bg-[#cce3de] border-[#cce3de] hover:bg-[#b0d4cc] hover:border-[#b0d4cc] hover:-translate-y-1 hover:shadow-soft-hover"
          }`}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
