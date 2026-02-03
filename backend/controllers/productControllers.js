import productModel from "../models/productModels.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.json({ success: false, message: "All fields required" });
    }

    const images = [];

    // Upload each image to Cloudinary
    try {
      if (req.files?.image1) {
        const result = await uploadToCloudinary(req.files.image1[0].buffer);
        images.push(result.secure_url);
      }
      if (req.files?.image2) {
        const result = await uploadToCloudinary(req.files.image2[0].buffer);
        images.push(result.secure_url);
      }
      if (req.files?.image3) {
        const result = await uploadToCloudinary(req.files.image3[0].buffer);
        images.push(result.secure_url);
      }
      if (req.files?.image4) {
        const result = await uploadToCloudinary(req.files.image4[0].buffer);
        images.push(result.secure_url);
      }
    } catch (uploadError) {
      console.log("❌ Cloudinary upload error:", uploadError);
      return res.json({ success: false, message: "Image upload failed" });
    }

    if (images.length === 0) {
      return res.json({ success: false, message: "At least 1 image required" });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      images, // Full Cloudinary URLs
      date: Date.now(),
    });

    res.json({
      success: true,
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    console.log("❌ Add product error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch products" });
  }
};

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

    // Optional: Delete images from Cloudinary
    try {
      for (let imageUrl of product.images) {
        // Extract public_id from Cloudinary URL
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        const publicId = `ecommerce-products/${filename}`;
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.log("⚠️ Warning: Could not delete images from Cloudinary:", error);
      // Continue with product deletion even if image deletion fails
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

const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: "Product not found" });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };