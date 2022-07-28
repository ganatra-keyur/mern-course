const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  loadPhoto,
  deleteProduct,
  updateProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);
router.param("productId", getProductById);

//Routes
router.post(
  "/product/create/:userId/",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", loadPhoto); //Execute the loading photo middleware when frontend acsk for photo

router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//listing route to list products on some page.
router.get("/products", getAllProducts);

//route to get all the available categories on the Product page so that admin can choose from
router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
