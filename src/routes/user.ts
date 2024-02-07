import CryptoJS from "crypto-js";
import { Router } from "express";
import { verifyAdmin, verifyAndAuthorize, verifyToken } from "./verifyToken.js";
import User from "../models/User.js";

const router = Router();

router.get("/test", function (req, res, next) {
  return res.status(200).json({ msg: "user test" });
});

// GET USER
router.get("/:id", verifyAdmin, async function (req, res, next) {
  try {
    const user = (await User.findById(req.params.id)).toObject();
    delete user.password;
    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All USERS
router.get("/", verifyAdmin, async function (req, res, next) {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PATCH
router.patch("/:id", verifyAndAuthorize, async function (req, res, next) {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyAndAuthorize, async function (req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json("User Deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
