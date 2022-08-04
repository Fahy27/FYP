import express from "express";
import { drawRandomQuestions, addQuestion, submitAnswers } from "../controllers/questions.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.get("/random", drawRandomQuestions)
router.post("/add", addQuestion)
router.post("/submitAnswers", auth, submitAnswers)
export default router