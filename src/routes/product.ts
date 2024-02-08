import { Router } from "express";
import { verifyAdmin } from "./verifyToken.js";
import Product, { ProductType } from "../models/Product.js";

const router = Router();

// GET Product
router.get("/:id", async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All Products
router.get("/", async function (req, res, next) {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products: ProductType[];

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } });
    } else {
      products = await Product.find();
    }

    return res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST
router.post("/", verifyAdmin, async function (req, res, next) {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PATCH
router.patch("/:id", verifyAdmin, async function (req, res, next) {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyAdmin, async function (req, res, next) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("Product Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
