const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

//We can define multiple Schema in a single Model

//Schema for Products in Cart
const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: "Product", //refering to Product Schema
  },
  name: String,
  count: Number,
  price: Number,
});

//Schema for Order
const orderSchema = new mongoose.Schema(
  {
    products: [ProductCartSchema], //Since there can be nultiple Products in Order
    transaction_id: {},
    amount: {
      type: Number,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2500,
    },
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId, //The user who ordered the Product. Refering to User Schema
      ref: "User",
    },
  },
  { timestamps: true }
);

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);
const Order = mongoose.model("Order", orderSchema);
module.exports = { Order, ProductCart };
