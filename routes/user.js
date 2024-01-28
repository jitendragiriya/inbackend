const express = require("express");  
const { getuser, googleAuth } = require("../controllers/user");
const { isAuthenticated } = require("../middlewares/protected-route");
const { explored } = require("../controllers/reminders");
const router = express.Router();

// ====================user routes ======================// 
router.post("/auth/google", googleAuth); 
router.get("/profile", isAuthenticated, getuser); 
router.post("/explored", isAuthenticated, explored); 

module.exports = router;