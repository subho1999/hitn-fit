const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const app = express();

const saltRounds = 5;

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
  let plainTextPass = req.body.psw;
  bcrypt.hash(plainTextPass, saltRounds, (err, hashedPass) => {
    if (err) throw err;
    signupDetails = {
      name: req.body.name,
      email: req.body.email,
      password: hashedPass
    };
    User.create(signupDetails, (err, response) => {
      if (err) {
        res.status(500).send();
      } else {
        res.redirect("/success");
      }
    });
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

  User.find({ email: loginDetails.email }, (err, response) => {
    if (err) throw err;
    else {
      if (Object.entries(response).length === 0) {
        res.redirect("/notFound");
      } else {
        bcrypt.compare(loginDetails.password, response[0].password, (error, resp) => {
          if (error) throw error;
          if (resp === true) {
            res.redirect("/successLogin");
          } else {
            res.redirect("/wrongPass");
          }
        });
      }
    }
  });
});

app.get("/successLogin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

app.get("/wrongPass", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "wrongpass.html"));
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
