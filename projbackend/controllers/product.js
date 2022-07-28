const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash"); //_ is a private varaible
const fs = require("fs"); //file system module, by default in Node

//fetching the categroy from param
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category") //populating based on Category
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found in DB",
        });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with File",
      });
    }

    //destructure the field
    const { name, description, price, category, stock } = fields;

    //checking if all the fields are passed
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields required!",
      });
    }
    let product = new Product(fields);

    //handling Files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //size should not be greater than 3MB
        return res.status(400).json({
          error: "File size to BIG!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //console.log(product);

    //saving to DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving product in DB Failed!",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined; //Since large size, we will handle and send this using Middleware
  return res.json(req.product);
};

//Middleware: To load product photos in the  background during get request
exports.loadPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let product = req.product; //Understand that, param will give you the product because the route has productID
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Delete Failed!",
      });
    }
    res.json({
      message: `Deleted ${deletedProduct} Successfully!`,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with File",
      });
    }

    //updating existing products
    let product = req.product;
    product = _.extend(product, fields); //lodash extend(destination, new Data or source) method, extends data with new one

    //handling Files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        //size should not be greater than 3MB
        return res.status(400).json({
          error: "File size to BIG!",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //console.log(product);

    //saving to DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updating product Failed!",
        });
      }
      res.json(product);
    });
  });
};

//Product listing
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No Products Found!",
        });
      }
      res.json(products);
    });
};

//Method to get all the available categories so that the admin can choose from
exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    //retruns distinct data, takes 3 params: Property, Options and Callback
    if (err) {
      return res.status(400).json({
        error: "No Categories Found!",
      });
    }
    res.json(category);
  });
};

//Updating Inventory
//When an order is placed, in Product model, we have stock and sold
//We need to decrement stock and increment sold accodingly
exports.updateStock = (req, res, next) => {
  //As we know, order has a products array. Using map() to iterate and perfrom operation
  let myOperations = req.body.order.products.map((prod) => {
    return {
      //returning object since buldWrite() accpets first param as Operation object
      updateOne: {
        filter: { _id: prod._id },
        //count will come from front end
        update: { $inc: { stock: -prod.count, sold: +prod.count } }, //$inc is how its done in MongoDB
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation Failed!",
      });
    }
    next();
  });
};
