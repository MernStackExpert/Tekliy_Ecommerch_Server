const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require("../controllers/orders.controller");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.patch("/:id", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
