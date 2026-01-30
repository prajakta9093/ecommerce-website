import userModel from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
const registerUser = async (req, res) => {
  try {
    console.log("📥 Register request received:", req.body);
    
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log("❌ Validation failed: Missing fields");
      return res.json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("❌ User already exists:", email);
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      profile: {
        firstName: "",
        lastName: "",
        phone: "",
      },
    });

    console.log("✅ User created successfully:", {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Token generated for user:", newUser._id);

    res.json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.log("❌ Register error:", error);
    res.json({
      success: false,
      message: "Registration failed",
    });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    console.log("📥 Login request received:", { email: req.body.email });
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("❌ Validation failed: Missing email or password");
      return res.json({
        success: false,
        message: "Email and password required",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("✅ User found:", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Password mismatch for:", email);
      return res.json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("✅ Password matched");

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Token generated for user:", user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.log("❌ Login error:", error);
    res.json({
      success: false,
      message: "Login failed",
    });
  }
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    console.log("📥 Admin login request received");
    
    const { email, password } = req.body;

    console.log("🔍 Checking credentials against env:", {
      providedEmail: email,
      envEmail: process.env.ADMIN_EMAIL,
      match: email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD,
    });

    // Check against environment variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("✅ Admin login successful");

      res.json({
        success: true,
        message: "Admin login successful",
        token,
      });
    } else {
      console.log("❌ Invalid admin credentials");
      res.json({
        success: false,
        message: "Invalid admin credentials",
      });
    }
  } catch (error) {
    console.log("❌ Admin login error:", error);
    res.json({
      success: false,
      message: "Admin login failed",
    });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    console.log("📥 Get profile request for user ID:", req.userId);
    
    const user = await userModel.findById(req.userId).select("-password");
    
    if (!user) {
      console.log("❌ User not found in database:", req.userId);
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User profile found:", {
      id: user._id,
      name: user.name,
      email: user.email,
      profile: user.profile,
    });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("❌ Get profile error:", error);
    res.json({
      success: false,
      message: "Failed to get profile",
    });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    console.log("📥 Update profile request:", {
      userId: req.userId,
      data: req.body,
    });
    
    const { firstName, lastName, phone } = req.body;

    const user = await userModel.findByIdAndUpdate(
      req.userId,
      {
        "profile.firstName": firstName,
        "profile.lastName": lastName,
        "profile.phone": phone,
      },
      { new: true }
    ).select("-password");

    console.log("✅ Profile updated successfully:", {
      id: user._id,
      profile: user.profile,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("❌ Update profile error:", error);
    res.json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export { 
  registerUser, 
  loginUser, 
  adminLogin, 
  getUserProfile, 
  updateUserProfile 
};