import { Router } from "express";
const router = Router();

router.get("/test", function (req, res, next) {
  return res.status(200).json({ msg: "user test" });
});

router.post("/", function (req, res, next) {
  const { userName } = req.body;
  console.log(userName);
  return res.status(200).json({ msg: userName });
});

export default router;
