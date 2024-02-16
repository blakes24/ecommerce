import { Router } from "express";
import { verifyAdmin } from "./verifyToken.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

const router = Router();

// GET USER STATS
router.get("/users", verifyAdmin, async function (req, res, next) {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    // new users per month in the last year
    const data = await User.aggregate([
      // find users created in the last year
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          // use month number from createdAt field
          month: { $month: "$createdAt" },
        },
      },
      // total users created in each month
      { $group: { _id: "$month", total: { $sum: 1 } } },
    ]);
    // total number of users
    const total = await User.countDocuments();

    return res.status(200).json({ newUsersPerMonth: data, totalUsers: total });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHlY INCOME STATS
router.get("/income", verifyAdmin, async function (req, res, next) {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: prevMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      { $group: { _id: "$month", total: { $sum: "$sales" } } },
    ]);

    return res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
