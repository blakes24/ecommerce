import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("DB connection successful"))
  .catch((err: Error) => {
    console.log(err);
  });

app.use(express.json());

app.get("/", function (req, res, next) {
  return res.status(200).json({ msg: "working" });
});
app.listen(process.env.PORT || 3001, () => {
  console.log("Server running on port 3001!");
});
