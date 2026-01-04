const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const bookRoutes = require("./routes/bookRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json()); // ⭐ VERY IMPORTANT

// mongodb connection
mongoose
  .connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// routes
app.use("/books", bookRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
