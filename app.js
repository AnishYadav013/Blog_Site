const express = require("express");
const ejs = require("ejs");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const usersSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String },
});
const postsSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
});
mongoose.connect("type your mongoose server link");
const users = mongoose.model("users", usersSchema);
const posts = mongoose.model("posts", postsSchema);

var error = "";
app.get("/", function (req, res) {
  res.render("landing", { error });
});

app.post("/login", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  // if (mongoose.connection.readyState === 1) {
  //   console.log("Database connected");
  //   } else {
  //     // The connection is not active
  //     console.log("Database not connected");

  //   }
  const temp = await users.find({ email: email, password: password });
  if (temp.length == 0) {
    error = "Email or Password Incorrect";
    res.redirect("/");
  } else {
    error = "";
    const mainShow = await posts.find({}).limit(6);
    res.render("main", { mainShow: mainShow });
  }
});
app.post("/register", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  res.render("/");
});
app.get("/main", async function (req, res) {
  const mainShow = await posts.find({}).limit(6);
  res.render("main", { mainShow: mainShow });
});
app.get("/blogs", async function (req, res) {
  const allposts = await posts.find({})
  res.render("blogs",{allposts: allposts});
});
app.get("/about", function (req, res) {
  res.render("about");
});
app.get("/contact", function (req, res) {
  res.render("contact");
});
app.get("/posts/:title", async function (req, res) {
  const data = await posts.find({ title: req.params.title});
  console.log(req.params.title);
  res.render("post", { title: data[0].title, content: data[0].content });
});
app.listen(3000, function () {
  console.log("Server Started at port 3000.");
});
