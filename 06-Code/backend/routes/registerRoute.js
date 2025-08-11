const express = require("express");
const controller = require('../controllers/registercontroller');
const router = express.Router();

router.get("/validate-token", controller.getValidateToken);
router.post("/send-email",controller.postInvite)

module.exports = router;
