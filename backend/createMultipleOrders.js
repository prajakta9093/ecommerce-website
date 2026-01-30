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

const createMultipleOrders = async () => {
  await connectDB();

  try {
    // Find or create test users
    let user1 = await userModel.findOne({ email: "test@example.com" });
    if (!user1) {
      user1 = await userModel.create({
        name: "John Doe",
        email: "test@example.com",
        password: "$2b$10$randomhash1",
        profile: {
          firstName: "John",
          lastName: "Doe",
          phone: "+91 9876543210",
        },
      });
    }

    let user2 = await userModel.findOne({ email: "jane@example.com" });
    if (!user2) {
      user2 = await userModel.create({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "$2b$10$randomhash2",
        profile: {
          firstName: "Jane",
          lastName: "Smith",
          phone: "+91 9123456789",
        },
      });
    }

    // Sample orders data
    const ordersData = [
      {
        userId: user1._id,
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
            productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
            quantity: 2,
            price: 2999,
          },
          {
            productId: new mongoose.Types.ObjectId(),
            productName: "Phone Case",
            productImage: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300",
            quantity: 1,
            price: 499,
          },
        ],
        totalAmount: 6497,
        paymentMethod: "COD",
        status: "Order Placed",
      },
      {
        userId: user1._id,
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
            productName: "Smart Watch",
            productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300",
            quantity: 1,
            price: 15999,
          },
        ],
        totalAmount: 15999,
        paymentMethod: "Online",
        paymentStatus: "Paid",
        status: "Shipped",
      },
      {
        userId: user2._id,
        customerName: "Jane Smith",
        email: "jane@example.com",
        phone: "+91 9123456789",
        address: {
          street: "456 Park Street",
          city: "Delhi",
          state: "Delhi",
          zipCode: "110001",
          country: "India",
        },
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            productName: "Laptop Bag",
            productImage: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300",
            quantity: 1,
            price: 1999,
          },
          {
            productId: new mongoose.Types.ObjectId(),
            productName: "Wireless Mouse",
            productImage: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300",
            quantity: 2,
            price: 799,
          },
        ],
        totalAmount: 3597,
        paymentMethod: "COD",
        status: "Processing",
      },
      {
        userId: user2._id,
        customerName: "Jane Smith",
        email: "jane@example.com",
        phone: "+91 9123456789",
        address: {
          street: "456 Park Street",
          city: "Delhi",
          state: "Delhi",
          zipCode: "110001",
          country: "India",
        },
        items: [
          {
            productId: new mongoose.Types.ObjectId(),
            productName: "Bluetooth Speaker",
            productImage: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300",
            quantity: 1,
            price: 4999,
          },
        ],
        totalAmount: 4999,
        paymentMethod: "Online",
        paymentStatus: "Paid",
        status: "Delivered",
      },
      {
        userId: user1._id,
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
            productName: "Power Bank",
            productImage: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300",
            quantity: 3,
            price: 1299,
          },
        ],
        totalAmount: 3897,
        paymentMethod: "COD",
        status: "Order Placed",
      },
    ];

    // Insert orders
    const orders = await Order.insertMany(ordersData);
    
    console.log(`\n✅ Created ${orders.length} orders successfully!\n`);
    console.log("📦 Order Summary:");
    console.log("─".repeat(60));
    
    orders.forEach((order, idx) => {
      console.log(`${idx + 1}. Order #${order._id.toString().slice(-8).toUpperCase()}`);
      console.log(`   Customer: ${order.customerName}`);
      console.log(`   Total: ₹${order.totalAmount.toLocaleString()}`);
      console.log(`   Status: ${order.status}`);
      console.log(`   Items: ${order.items.length}`);
      console.log("");
    });

    console.log("─".repeat(60));
    console.log(`\n👤 User 1 (John): ${user1.email} - ${orders.filter(o => o.userId.equals(user1._id)).length} orders`);
    console.log(`👤 User 2 (Jane): ${user2.email} - ${orders.filter(o => o.userId.equals(user2._id)).length} orders`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

createMultipleOrders();