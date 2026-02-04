import productModel from "../models/productModels.js";
import {cloudinary} from "../config/cloudinary.js";

/* =========================
   ADD PRODUCT
========================= */
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.json({ success: false, message: "All fields required" });
    }

    const images = [];
    const imageFields = ["image1", "image2", "image3", "image4"];

    for (const field of imageFields) {
      if (req.files?.[field]) {
        const filePath = req.files[field][0].path;

        const result = await cloudinary.uploader.upload(filePath, {
          folder: "products",
        });

        images.push(result.secure_url);
      }
    }

    if (images.length === 0) {
      return res.json({ success: false, message: "At least 1 image required" });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      images, // ✅ Cloudinary URLs
      date: Date.now(),
    });

    res.json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.error("❌ Add product error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

/* =========================
   LIST PRODUCTS
========================= */
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ List products error:", error);
    res.json({ success: false, message: "Failed to fetch products" });
  }
};

/* =========================
   REMOVE PRODUCT
========================= */
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findById(id);

    if (!product) {
      return res.json({
        success: false,
        message: "Product not found",
      });
    }

    // Optional: delete images from Cloudinary
    for (const img of product.images) {
      const publicId = img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await productModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Product removed successfully",
    });

  } catch (error) {
    console.error("❌ Delete product error:", error);
    res.json({
      success: false,
      message: "Delete failed",
    });
  }
};

/* =========================
   SINGLE PRODUCT
========================= */
const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Single product error:", error);
    res.json({ success: false, message: "Product not found" });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
