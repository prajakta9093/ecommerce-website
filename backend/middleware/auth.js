import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.replace('Bearer ', '');

    console.log("🔐 Auth middleware triggered");
    console.log("🔍 Token received:", token ? `${token.substring(0, 20)}...` : "No token");

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login",
        code: "NO_TOKEN"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", {
      userId: decoded.id,
      role: decoded.role,
    });
    
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    next();
  } catch (error) {
    console.log("❌ Auth middleware error:", error.message);
    
    // Distinguish between expired and invalid tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token has expired. Please login again",
        code: "TOKEN_EXPIRED"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again",
        code: "INVALID_TOKEN"
      });
    }
    
    // Generic error
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      code: "AUTH_FAILED"
    });
  }
};

export default authMiddleware;