import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

import { buyReward, createReward, listRewards } from "../controllers/rewards.js";

router.post("/add", auth, createReward);
router.post("/buy", auth, buyReward);
router.get("/list", listRewards);

export default router;