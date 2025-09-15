import express from "express";
import { loginUser } from "../controllers/authController.js"; // <-- must match export

const router = express.Router();

router.post("/login", loginUser);

export default router;
