const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema; //becasue we will need to refer to another model, we will need Object ID

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 1500,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },
    category: {
      //since every Product will have a category
      type: ObjectId, //This is how we refer to another Model
      ref: "Category", //Name of the Model to refer to fetch data from
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
