import express from 'express';
import twilio from 'twilio';

const router = express.Router();

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const adminPhoneNumber = process.env.ADMIN_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Send SMS notification for new order
router.post('/send-order-notification', async (req, res) => {
  try {
    const { 
      customerName, 
      customerPhone, 
      orderItems,
      orderTotal,
      orderId 
    } = req.body;

    // Validate required fields
    if (!customerName || !customerPhone || !orderTotal || !orderId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Format order items for message
    const itemsList = orderItems && orderItems.length > 0
      ? orderItems.map(item => `${item.quantity}x ${item.name}`).join(', ')
      : 'Order details';

    // Message for customer
    const customerMessage = `Hi ${customerName}! 🧵

Thank you for your order at Yarn Yapper!

Order ID: ${orderId}
Items: ${itemsList}
Total: ₹${orderTotal}

We'll start crafting your handmade items with love. You'll receive updates soon!

- Yarn Yapper Team 🤎`;

    // Message for admin
    const adminMessage = `🔔 NEW ORDER RECEIVED!

Order ID: ${orderId}
Customer: ${customerName}
Phone: ${customerPhone}
Items: ${itemsList}
Total: ₹${orderTotal}

Check your dashboard for details.`;

    // Send SMS to customer
    console.log(`Sending SMS to customer: ${customerPhone}`);
    const customerSMS = await client.messages.create({
      body: customerMessage,
      from: twilioPhoneNumber,
      to: customerPhone
    });

    // Send SMS to admin
    console.log(`Sending SMS to admin: ${adminPhoneNumber}`);
    const adminSMS = await client.messages.create({
      body: adminMessage,
      from: twilioPhoneNumber,
      to: adminPhoneNumber
    });

    console.log('✅ SMS sent successfully');
    console.log('Customer Message SID:', customerSMS.sid);
    console.log('Admin Message SID:', adminSMS.sid);

    res.json({
      success: true,
      message: 'Notifications sent successfully',
      customerMessageSid: customerSMS.sid,
      adminMessageSid: adminSMS.sid
    });

  } catch (error) {
    console.error('❌ SMS Error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send SMS'
    });
  }
});

// Test endpoint to verify SMS is working
router.post('/test-sms', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    const message = await client.messages.create({
      body: '🧵 Test message from Yarn Yapper! Your SMS notifications are working correctly.',
      from: twilioPhoneNumber,
      to: phoneNumber
    });

    res.json({
      success: true,
      message: 'Test SMS sent successfully',
      messageSid: message.sid
    });

  } catch (error) {
    console.error('Test SMS Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;