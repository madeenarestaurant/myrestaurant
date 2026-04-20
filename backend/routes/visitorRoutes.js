const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { trackVisitor, updateTimeSpent, trackClick, getStats } = require("../controllers/visitorController");


router.post("/track", trackVisitor);
router.post("/time", updateTimeSpent);
router.post("/click", trackClick);
router.get("/stats", auth, getStats);


module.exports = router;
