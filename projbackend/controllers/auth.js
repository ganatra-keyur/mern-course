const User = require("../models/user");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  //checking for validation errors before saving data to database
  //with express validator, we get (check/body and validation result which returns and errors array)
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      //parsing errors arrays and getting required properties. Refer DOC for more.
      error: [errors.array()[0].msg, errors.array()[0].param],
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  //getting email and password
  const { email, password } = req.body;

  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      //parsing errors arrays and getting required properties. Refer DOC for more.
      error: [errors.array()[0].msg, errors.array()[0].param],
    });
  }

  User.findOne({ email }, (err, user) => {
    //checking if error is returned
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists!",
      });
    }

    //if no error, using the authenticate() method User model that we had defined
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match!",
      });
    }

    //If all OK, signin the user (Create token and put it in Cookie)
    const authToken = jwt.sign({ _id: user._id }, process.env.SECRET);

    //put token in cookie
    res.cookie("token", authToken, { expire: new Date() + 9999 });
    //send res to frontend
    const { _id, name, email, role } = user;
    return res.json({ authToken, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  //In sign out just clear cookie and send response
  res.clearCookie("token");
  res.json({
    message: "User Signout Successful!",
  });
};

//Protected Routes
//Below is a middleware for Signin route. We don't have next() because expressJwt() has got us covered!
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  userProperty: "auth",
});

//Custom middlewares
exports.isAuthenticated = (req, res, next) => {
  //req.profile will be set from frontend, it will be only set if users owns the account
  //below we do a simple check, if the user req has auth and profile and if ID's of both of these match
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED!",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  //req.profile will be set from frontend
  if (req.profile.role === 0) {
    return res.status(403).json({
      error: "ACCESS DENIED!, User not Admin",
    });
  }
  next();
};
