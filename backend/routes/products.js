import express from "express";
import { getAll, getById, create, update, remove } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAll);        // Get all products
router.get("/:id", getById);    // Get one product
router.post("/", create);       // Add new product
router.put("/:id", update);     // Update product
router.delete("/:id", remove);  // Delete product

export default router;
