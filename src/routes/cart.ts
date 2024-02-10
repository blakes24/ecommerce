import { Router } from "express";
import { verifyAdmin, verifyAndAuthorize, verifyToken } from "./verifyToken.js";
import Cart from "../models/Cart.js";

const router = Router();

// GET Cart
router.get("/:userId", verifyAndAuthorize, async function (req, res, next) {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    return res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
router.post("/", verifyToken, async function (req, res, next) {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(201).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PATCH
router.patch("/:userId", verifyAndAuthorize, async function (req, res, next) {
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:userId", verifyAndAuthorize, async function (req, res, next) {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    return res.status(200).json("Cart Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All CARTS
router.get("/", verifyAdmin, async function (req, res, next) {
  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
