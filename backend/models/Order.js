const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 🔐 Link to logged-in user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 Customer Info
    firstName: String,
    lastName: String,
    email: String,
    phone: String,

    // 📍 Address
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,

    // 📦 Order Info
    product: String,
    quantity: Number,
    unitPrice: Number,
    totalAmount: Number,

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);