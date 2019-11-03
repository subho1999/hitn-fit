const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

mongoose.connect("mongodb://localhost/userFitDB");
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", err => console.log(err));

const User = require("./models/User");
