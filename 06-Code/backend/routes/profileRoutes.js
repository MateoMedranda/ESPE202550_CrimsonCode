const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController');
const {verifyToken} = require('../middleware/auth');

router.use(verifyToken);
router.get('/profiles', controller.getAllProfiles);
router.get('/profilesTable', controller.getProfilesTable);
router.get('/permits', controller.getPermits);
router.post('/profiles', controller.createProfile);
router.put('/profiles/:id', controller.updateProfile);
router.patch('/profiles/:id/state', controller.toggleProfile);

module.exports = router;
