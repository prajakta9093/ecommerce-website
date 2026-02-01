import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import orderRouter from './routes/orderRoute.js'; // Add this
import customOrderRoute from './routes/customorderRoute.js';

const app = express();
const port = process.env.PORT || 9000;
connectDB();
connectCloudinary();

app.use(express.json());
app.use(cors());

// Serve static files from uploads folder
app.use('/uploads', express.static('uploads'));

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/order', orderRouter); // Add this
app.use("/api/custom-order", customOrderRoute);
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(port, () => console.log(`Server is running on port: ${port}`));