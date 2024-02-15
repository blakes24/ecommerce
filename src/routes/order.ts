import { Router } from "express";
import { verifyAdmin, verifyToken } from "./verifyToken.js";
import Order from "../models/Order.js";

const router = Router();

// GET Order
router.get("/:id", verifyToken, async function (req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!req.user.isAdmin && order.userId !== req.user.id) {
      return res.status(403).json("Permission denied");
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
router.post("/", verifyToken, async function (req, res, next) {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PATCH
router.patch("/:id", verifyAdmin, async function (req, res, next) {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyAdmin, async function (req, res, next) {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json("Order Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All Orders
router.get("/", verifyAdmin, async function (req, res, next) {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
