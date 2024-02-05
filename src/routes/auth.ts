import { Router } from "express";
import CryptoJS from "crypto-js";
import User from "../models/User.js";

const router = Router();

router.post("/register", async function (req, res, next) {
  const { username, email, password } = req.body;
  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SECRET),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }

  // console.log(username, email, password);
  // return res.status(200).json({ msg: username });
});

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      username,
    });
    if (!user) {
      res.status(401).json("user not found");
      return;
    }

    const hashedPass = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SECRET
    ).toString(CryptoJS.enc.Utf8);

    if (hashedPass === password) {
      const userInfo = user.toObject();
      delete userInfo.password;
      res.status(200).json(userInfo);
    } else {
      res.status(401).json({ msg: "Invalid Password" });
    }
  } catch (err) {
    res.status(500).json(err);
  }

  // console.log(username, email, password);
  // return res.status(200).json({ msg: username });
});

export default router;
