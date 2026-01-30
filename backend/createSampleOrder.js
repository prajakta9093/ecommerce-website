import mongoose from "mongoose";
import 'dotenv/config';
import Order from "./models/orderModels.js";
import userModel from "./models/userModels.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error);
    process.exit(1);
  }
};

const createSampleOrder = async () => {
  await connectDB();

  try {
    // Find or create test user
    let user = await userModel.findOne({ email: "test@example.com" });
    
    if (!user) {
      user = await userModel.create({
        name: "John Doe",
        email: "test@example.com",
        password: "$2b$10$randomhashedpassword",
        profile: {
          firstName: "John",
          lastName: "Doe",
          phone: "+91 9876543210",
        },
      });
      console.log("✅ Created test user");
    }

    // Create sample order
    const sampleOrder = {
      userId: user._id,
      customerName: "John Doe",
      email: "test@example.com",
      phone: "+91 9876543210",
      address: {
        street: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        country: "India",
      },
      items: [
        {
          productId: new mongoose.Types.ObjectId(),
          productName: "Wireless Headphones",
          productImage: "https://via.placeholder.com/150",
          quantity: 2,
          price: 2999,
        },
        {
          productId: new mongoose.Types.ObjectId(),
          productName: "Phone Case",
          productImage: "https://via.placeholder.com/150",
          quantity: 1,
          price: 499,
        },
      ],
      totalAmount: 6497,
      paymentMethod: "COD",
      status: "Order Placed",
    };

    const order = await Order.create(sampleOrder);
    console.log(`✅ Sample order created: #${order._id.toString().slice(-8).toUpperCase()}`);
    console.log(`   Total: ₹${order.totalAmount}`);
    console.log(`   Status: ${order.status}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createSampleOrder();