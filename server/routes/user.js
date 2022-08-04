import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

import { getLeaderboard, signin, signup, getCurrentUserData } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.get("/leaderboard", getLeaderboard)
router.get("/getData", auth, getCurrentUserData)

export default router;