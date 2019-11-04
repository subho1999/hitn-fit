const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

mongoose.connect("mongodb://localhost/userFitDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", err => console.log(err));

const userSchema = mongoose.Schema({
  name: String,
  password: String,
  email: String
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const User = new mongoose.model("users", userSchema);

app.post("/signup", (req, res) => {
  signupDetails = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.psw
  };
  User.create(signupDetails, (err, response) => {
    if (err) {
      res.redirect("/notFound");
    } else {
      res.redirect("/success");
    }
  });
});

app.get("/notFound", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notfound.html"));
});

app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", (req, res) => {
  loginDetails = {
    email: req.body.email,
    password: req.body.psw
  };
  User.find({ email: loginDetails.email, password: loginDetails.password }, (err, response) => {
    if (err) throw err;
    else {
      if (Object.entries(response).length == 0) {
        res.redirect("/notFound");
      } else {
        res.redirect("/successLogin");
      }
    }
  });
});

app.get("/successLogin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
