const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/reportController");
const { authMiddleware } = require("../controllers/authController");

router.get("/sales", authMiddleware, ctrl.salesOverview);
router.get("/insights", authMiddleware, ctrl.aiInsights);

module.exports = router;
