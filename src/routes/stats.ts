import { Router } from "express";
import { verifyAdmin, verifyAndAuthorize, verifyToken } from "./verifyToken.js";
import User from "../models/User.js";

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

export default router;
