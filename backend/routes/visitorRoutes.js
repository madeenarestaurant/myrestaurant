const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { trackVisitor, updateTimeSpent, trackClick, getStats, getAllVisitors } = require("../controllers/visitorController");


router.post("/track", trackVisitor);
router.post("/time", updateTimeSpent);
router.post("/click", trackClick);
router.get("/stats", auth, getStats);
router.get("/", auth, getAllVisitors);


module.exports = router;
