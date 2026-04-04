const { connectDB } = require("../config/db");

const getAdminStats = async (req, res) => {
  try {
    const db = await connectDB();
    
    const productCount = await db.collection("products").countDocuments();
    const categoryCount = await db.collection("categories").countDocuments();
    const orderCount = await db.collection("orders").countDocuments();
    const contactCount = await db.collection("contacts").countDocuments({ status: "unread" });
    const adminCount = await db.collection("admins").countDocuments();

    const orders = await db.collection("orders").find().toArray();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const pendingOrders = await db.collection("orders").countDocuments({ orderStatus: "pending" });
    const completedOrders = await db.collection("orders").countDocuments({ orderStatus: "delivered" });

    res.status(200).send({
      totalProducts: productCount,
      totalCategories: categoryCount,
      totalOrders: orderCount,
      totalRevenue: totalRevenue,
      unreadMessages: contactCount,
      totalAdmins: adminCount,
      orderStats: {
        pending: pendingOrders,
        completed: completedOrders
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch dashboard stats", error: error.message });
  }
};

module.exports = { getAdminStats };