const Order = require("../models/Order");

//////////////////////////////////////////////////////
// CREATE ORDER
//////////////////////////////////////////////////////
exports.createOrder = async (req, res) => {
  try {
    const data = req.body;

    // ✅ Validation
    if (data.quantity < 1) {
      return res.status(400).json({ message: "Quantity cannot be below 1" });
    }

    // ✅ Calculate total
    data.totalAmount = data.quantity * data.unitPrice;

    // 🔐 Attach logged-in user
    data.user = req.user.id;

    const order = new Order(data);

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////////////////
// GET ORDERS (ONLY USER'S ORDERS)
//////////////////////////////////////////////////////
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////////////////
// UPDATE ORDER (ONLY OWN ORDER)
//////////////////////////////////////////////////////
exports.updateOrder = async (req, res) => {
  try {
    const data = req.body;

    if (data.quantity < 1) {
      return res.status(400).json({ message: "Quantity cannot be below 1" });
    }

    data.totalAmount = data.quantity * data.unitPrice;

    // 🔐 Ensure user owns the order
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      data,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////////////////////////////
// DELETE ORDER (ONLY OWN ORDER)
//////////////////////////////////////////////////////
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};