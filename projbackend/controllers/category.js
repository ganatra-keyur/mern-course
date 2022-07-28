const Category = require("../models/category");

//fetching the categroy from param
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = category;
    next();
  });
};

//create
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save category in DB",
      });
    }
    res.json({ category });
  });
};

//fetch
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found!",
      });
    }
    res.json(categories);
  });
};

//update
exports.updateCategory = (req, res) => {
  const category = req.category; //grabbing from ID using middleware
  category.name = req.body.name; //grabbing category from fronted

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }
    res.json(updatedCategory);
  });
};

//delete
exports.removeCategory = (req, res) => {
  const category = req.category; //grabbing param

  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Delete Unsuccessful!",
      });
    }
    res.json({
      message: `Successfully Deleted ${category.name} Category!`,
    });
  });
};
