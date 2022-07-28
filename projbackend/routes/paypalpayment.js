const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getToken, processPayment } = require("../controllers/paypalpayment");
const { getUserById } = require("../controllers/user");

//params
router.param("userId", getUserById);

//Route to generate Token
router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

//To submit payment Info
router.post(
  "/payment/braintree/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
