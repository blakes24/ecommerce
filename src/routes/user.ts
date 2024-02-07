import CryptoJS from "crypto-js";
import { Router } from "express";
import { verifyAndAuthorize, verifyToken } from "./verifyToken.js";
import User from "../models/User.js";

const router = Router();

router.get("/test", function (req, res, next) {
  return res.status(200).json({ msg: "user test" });
});

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

export default router;
