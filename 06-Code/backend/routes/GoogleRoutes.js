const express = require('express');
const router = express.Router();
const googleController = require('../controllers/apiGoogle')

router.post('/google', googleController.postOAUTHGoogle)

module.exports = router;