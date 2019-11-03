const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

mongoose.connect("mongodb://localhost/userFitDB");
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", err => console.log(err));

let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const User = new mongoose.model("user", userSchema);

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
