const express = require("express");
const router = express.Router({mergeParams:true});
const controlController = require("../controllers/controlController");
const {verifyToken} = require('../middleware/auth');

router.use(verifyToken);
router.get("/controls/", controlController.getAllControlls);
router.get("/controls/:controlId", controlController.getControllById);
router.post("/controls/", controlController.createControll);
router.put("/controls/:controlId", controlController.updateControll);
router.patch("/controls/:controlId", controlController.deleteControll);

module.exports = router;