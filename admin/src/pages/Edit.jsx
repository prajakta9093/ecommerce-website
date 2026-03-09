import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";

const backendUrl = import.meta.env.VITE_BACKENDURL || "http://localhost:9000";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // We are storing URLs from the backend directly in here if they haven't changed,
  // OR File objects if the user selected a new image.
  const [images, setImages] = useState([null, null, null, null]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hoops");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 1. Fetch existing product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/single/${id}`);
        if (res.data.success) {
          const product = res.data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category);

          // Populate images
          const loadedImages = [null, null, null, null];
          if (product.images) {
            product.images.forEach((img, index) => {
              if (index < 4) {
                // Ensure absolute URL
                loadedImages[index] = img.startsWith("http")
                  ? img
                  : `${backendUrl}/${img.replace(/\\/g, "/")}`;
              }
            });
          }
          setImages(loadedImages);
        } else {
          alert("Failed to load product for editing");
          navigate("/list");
        }
      } catch (error) {
        console.error(error);
        alert("Error loading product");
        navigate("/list");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  // 2. Submit Updates
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !description || !price) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);

      // Only append files. If an index is a string (URL), it means the image wasn't changed.
      // (The backend is currently written to just REPLACE images if ANY new file is uploaded.
      // If we upload even 1 new file, ALL old ones are wiped and only new ones are saved!
      // To strictly adhere to that, we only send actual File objects).
      let hasNewImages = false;
      images.forEach((img, i) => {
        if (img instanceof File) {
          formData.append(`image${i + 1}`, img);
          hasNewImages = true;
        }
      });

      const res = await axios.post(
        `${backendUrl}/api/product/update`,
        formData
      );

      if (res.data.success) {
        alert("Product updated successfully!");
        navigate("/list");
      } else {
        alert(res.data.message || "Failed to update product");
      }
    } catch (error) {
      console.log(error);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64 px-4">
        <p className="text-base sm:text-lg">Loading product data...</p>
      </div>
    );
  }

  // Helper to render image preview (string URL or local File obj)
  const renderImagePreview = (img) => {
    if (!img) return assets.upload_area;
    if (typeof img === "string") return img;
    return URL.createObjectURL(img);
  };

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <form
        onSubmit={submitHandler}
        className="bg-white/80 backdrop-blur-sm w-full max-w-3xl p-8 md:p-10 rounded-3xl shadow-soft border border-[#e6dfce]"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-['Playfair_Display'] text-[#2b2824] flex items-center gap-2">
            <span className="text-[#cce3de] text-2xl">◆</span> Edit Product
          </h2>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="text-sm font-bold text-[#6e655a] hover:text-[#2b2824] px-4 py-2 border border-[#e6dfce] rounded-full hover:bg-white transition-all shadow-sm"
          >
            Cancel
          </button>
        </div>

        {/* IMAGES */}
        <div className="mb-6">
          <p className="mb-3 font-medium text-[#2b2824]">
            Update Images (Uploading any new image will replace all old images)
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, i) => (
              <label
                key={i}
                className="cursor-pointer flex items-center justify-center group"
              >
                <img
                  src={renderImagePreview(img)}
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
          {loading ? "Saving Changes..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Edit;
