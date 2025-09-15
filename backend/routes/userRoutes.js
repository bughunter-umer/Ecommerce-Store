import express from "express";
import { getUserByEmail, createUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single user by email
router.get("/email/:email", async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new user
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body; // <-- now using name, email, password
    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email, and password are required" });

    const existingUser = await getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: "Email already exists" });

    const newUser = await createUser(name, email, password); // <-- passes all three to controller
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
