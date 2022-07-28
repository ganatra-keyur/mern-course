const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post(
  "/signup",
  [
    //signup validation
    check("name")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 chars long"),
    check("email").isEmail().withMessage("Email seems incorrect"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long"),
  ],
  signup
);

router.post(
  "/signin",
  [
    //signin validation
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
  ],
  signin
);

router.get("/signout", signout);

//here, isSignedIn is a middleware
router.get("/testRoute", isSignedIn, (req, res) => {
  res.json(req.auth);
});

module.exports = router;
