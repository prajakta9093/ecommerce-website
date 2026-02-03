import productModel from "../models/productModels.js";

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.json({ success: false, message: "All fields required" });
    }

    const images = [];

    if (req.files?.image1) images.push(req.files.image1[0].path.replace(/\\/g, '/'));
    if (req.files?.image2) images.push(req.files.image2[0].path.replace(/\\/g, '/'));
    if (req.files?.image3) images.push(req.files.image3[0].path.replace(/\\/g, '/'));
    if (req.files?.image4) images.push(req.files.image4[0].path.replace(/\\/g, '/'));

    if (images.length === 0) {
      return res.json({ success: false, message: "At least 1 image required" });
    }

    const product = await productModel.create({
      name,
      description,
      price,
      category,
      images,
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
