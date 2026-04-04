const { connectDB, ObjectId } = require("../config/db");
const sendOrderEmail = require("../utils/sendOrderEmail");

const collection = async () => {
  const db = await connectDB();
  return db.collection("orders");
};

const createOrder = async (req, res) => {
  try {
    const ordersCollection = await collection();
    const {
      customerName,
      customerPhone,
      customerEmail,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod
    } = req.body;

    if (!customerEmail || !products || products.length === 0 || !totalAmount) {
      return res.status(400).send({ message: "Invalid order data" });
    }

    const order = {
      customerName,
      customerPhone,
      customerEmail,
      products,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(order);
    const orderId = result.insertedId;

    const emailTemplate = `
      <div style="background-color: #001B3D; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          
          <div style="background: linear-gradient(135deg, #0052CC 0%, #001B3D 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">TEKLIY</h1>
            <p style="color: #4DABF7; margin: 5px 0 0; font-size: 14px;">Your Premium Tech Partner</p>
          </div>

          <div style="padding: 30px; color: #333;">
            <h2 style="color: #0052CC; margin-top: 0;">Order Confirmed!</h2>
            <p style="font-size: 16px;">Hello <b>${customerName}</b>, thank you for your order. We are processing it right now.</p>
            
            <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 5px 0;"><b>Order ID:</b> <span style="color: #0052CC;">#${orderId}</span></p>
              <p style="margin: 5px 0;"><b>Date:</b> ${new Date().toLocaleDateString()}</p>
              <p style="margin: 5px 0;"><b>Payment:</b> Cash on Delivery</p>
            </div>

            <h3 style="border-bottom: 2px solid #F8FAFC; padding-bottom: 10px; color: #001B3D;">Items Ordered</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
              <thead>
                <tr style="text-align: left; font-size: 14px; color: #64748B;">
                  <th style="padding: 10px 0;">Product</th>
                  <th style="padding: 10px 0; text-align: center;">Qty</th>
                  <th style="padding: 10px 0; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${products.map(p => `
                  <tr style="border-bottom: 1px solid #F1F5F9;">
                    <td style="padding: 12px 0; font-weight: 500;">${p.name}</td>
                    <td style="padding: 12px 0; text-align: center;">${p.quantity}</td>
                    <td style="padding: 12px 0; text-align: right;">৳${p.price * p.quantity}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="margin-top: 20px; text-align: right;">
              <p style="font-size: 18px; color: #001B3D;">Total Amount: <span style="color: #0052CC; font-weight: bold; font-size: 22px;">৳${totalAmount}</span></p>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #EEF2FF; border-radius: 8px;">
              <h4 style="margin: 0 0 10px 0; color: #0052CC;">Shipping Address:</h4>
              <p style="margin: 0; font-size: 14px; color: #475569;">${shippingAddress}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #475569;">Phone: ${customerPhone}</p>
            </div>
          </div>

          <div style="background: #F8FAFC; padding: 20px; text-align: center; border-top: 1px solid #E2E8F0;">
            <p style="margin: 0; color: #64748B; font-size: 12px;">&copy; ${new Date().getFullYear()} TEKLIY. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    try {
      await sendOrderEmail({
        to: customerEmail,
        subject: `Order Confirmed - #${orderId} | TEKLIY`,
        html: emailTemplate,
      });

      await sendOrderEmail({
        to: process.env.EMAIL_USER,
        subject: `New Order Received - #${orderId} | TEKLIY Admin`,
        html: `<h2>New Order Alert!</h2> <p>Check Admin Dashboard for Order ID: ${orderId}</p> ${emailTemplate}`,
      });
    } catch (emailError) {
      console.error("Email Error:", emailError.message);
    }

    res.status(201).send({
      message: "Order placed successfully",
      orderId: orderId,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to create order", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const ordersCollection = await collection();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalOrders = await ordersCollection.countDocuments();
    const orders = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.send({
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      orders,
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch orders", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const ordersCollection = await collection();
    const id = req.params.id;
    const { orderStatus, paymentStatus } = req.body;

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...(orderStatus && { orderStatus }),
          ...(paymentStatus && { paymentStatus }),
          updatedAt: new Date() 
        } 
      }
    );

    res.send({ message: "Order updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to update order", error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const ordersCollection = await collection();
    const id = req.params.id;
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    res.send({ message: "Order deleted successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Failed to delete order", error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
};