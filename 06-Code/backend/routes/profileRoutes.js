const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');

router.get('/profiles', controller.getProfiles);
router.get('/permits', controller.getPermits);
router.post('/profiles', controller.createProfile);
router.put('/profiles/:id', controller.updateProfile);
router.patch('/profiles/:id/state', controller.toggleProfile);

module.exports = router;
