const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/users', controller.getUsers);
router.get('/usersTable', controller.getUsersTable);
router.get('/profiles',controller.getProfiles);
router.get('/profileslist',controller.getProfilesChecklist);
router.get('/users/:id',controller.SearchUser);
router.post('/users', controller.createUser);
router.put('/users/:id', controller.updateUser);
router.patch('/users/:id', controller.toggleUser);

module.exports = router;