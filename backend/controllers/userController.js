import pool from "../db.js";
import bcrypt from "bcryptjs";

// Get user by email
export const getUserByEmail = async (email) => {
  const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return res.rows[0];
};

// Create new user
export const createUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, hashedPassword]
  );
  return res.rows[0];
};

// Get all users
export const getAllUsers = async () => {
  const res = await pool.query("SELECT id, name, email FROM users");
  return res.rows;
};
