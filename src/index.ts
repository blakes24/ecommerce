import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/auth.js";
import statRoutes from "./routes/stats.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";

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

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/stats", statRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running on port 3001!");
});
