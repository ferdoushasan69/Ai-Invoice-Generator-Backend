const express = require("express");
const {
    pareseInvoiceFromText,
    generateReminderEmail,
    getDashboardSummary
} = require("../controllers/aiController.js");

const { protect } = require("../middlewares/authMiddleWare.js");

const router = express.Router();

router.post("/parse-text", protect, pareseInvoiceFromText);
router.post("generate-reminder", protect, generateReminderEmail);
router.get("dashboard-summary", protect, getDashboardSummary);

module.exports = router;