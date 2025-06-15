const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');

router.post('/get', controller.getProfiles);
router.post('/permits', controller.getPermits);
router.post('/create', controller.createProfile);
router.post('/update', controller.updateProfile);
router.post('/toggle', controller.toggleProfile);

module.exports = router;
