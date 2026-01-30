import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization required.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin
    if (decoded.role !== "admin" && decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default adminAuth;