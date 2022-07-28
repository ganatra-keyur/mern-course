const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Home Page");
});

const admin = (req, res) => {
  res.send("Admin Page");
};
const isAdmin = (req, res, next) => {
  console.log("isAdmin running!");
  next();
};
app.get("/admin", isAdmin, admin); //instead of callback, a method used!

app.get("/login", (req, res) => {
  res.send("Login Page");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
