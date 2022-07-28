const User = require("../models/user");
const Order = require("../models/order");

//Controller for user route handling the paramter
exports.getUserById = (req, res, next, id) => {
  //ID is the parameter in the route
  User.findById(id).exec((err, user) => {
    //findById() is a Mongo method
    if (err || !user) {
      return res.status(400).json({
        error: "User Not Found!",
      });
    }
    req.profile = user; //req.profile will come from front end and we set the user if user if found
    next();
  });
};

exports.getUser = (req, res) => {
  //req.profile will have the user object which has all the user properties that will go to frontend
  //We dont want to send all the details for secuirty purposes, Hence we protect them in the following way
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined; //comes from timestamp
  req.profile.updatedAt = undefined; //comes from timestamp
  return res.json(req.profile);
};

//updating User
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "Database update unsuccessful! Not Authorized",
        });
      }

      user.salt = undefined;
      user.encry_password = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

//fetching user orders from the Order model
exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id }) //pulling data from Order
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No Order in this Account",
        });
      }

      return res.json(order);
    });
};

//Creating a new middleware to push orders done by the user in the User model
//to fill the purchases property in the User model
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    //from order model, pulling the products property which is an array, hence looping through it
    purchases.push({
      //below stuff should come from frontend
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });
  //storing in DB
  User.findOneAndUpdate(
    //finding and updating
    { _id: req.profile._id },
    { $push: { purchases: purchases } }, //since array, hence $push
    { new: true },
    (err, purchases) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to save purchase list",
        });
      }
      next(); //if no error, next
    }
  );
};
