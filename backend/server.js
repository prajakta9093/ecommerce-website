import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import {connectCloudinary} from "./config/cloudinary.js";

import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import customorderRoute from "./routes/customorderRoute.js";
import contactRouter from "./routes/contactRoute.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderNotificationRoutes from './routes/orderNotification.js';

const app = express();
const port = process.env.PORT || 10000;


connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));
app.use('/api/orders', orderNotificationRoutes);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reviews", reviewRouter);
app.use('/api/orders', orderNotificationRoutes);

/* ✅ Fixed: /api/customorders — matches frontend axios calls */
app.use("/api/customorders", customorderRoute);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📱 SMS notifications enabled`);
});