const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/users', controller.getUsers);
router.get('/profileslist',controller.getProfiles);
router.get('/users/:id',controller.SearchUser);
router.post('/users', controller.createUser);
router.put('/users/:id', controller.updateUser);
router.patch('/users/:id', controller.toggleUser);

module.exports = router;