const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {verifyToken} = require('../middleware/auth');


router.get('/users', verifyToken ,controller.getUsers);
router.get('/usersTable',verifyToken, controller.getUsersTable);
router.get('/profiles',verifyToken,controller.getProfiles);
router.get('/profileslist',verifyToken,controller.getProfilesChecklist);
router.get('/users/:id',verifyToken,controller.SearchUser);
router.post('/users', controller.createUser);
router.put('/users/:id', verifyToken,controller.updateUser);
router.patch('/users/:id',verifyToken ,controller.toggleUser);

module.exports = router;