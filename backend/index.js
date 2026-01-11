import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.URI;
import mongoose from "mongoose";
mongoose
  .connect(URI)
  .then(() => {
    console.log("App Connected to the DB");
  })
  .catch((error) => {
    console.log("App is not connected to the DB:" ,error.message);
  });
app.get("/", (req, res) => {
  return res.send("Hello");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

