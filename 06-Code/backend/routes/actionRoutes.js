const express = require('express');
const router = express.Router();
const controller = require('../controllers/actionController');

router.get('/actions', controller.getActions);
router.get('/user/:personal_id', controller.getActionByPersonalId);
router.get('/date', controller.getActionByDate);
router.post('/', controller.postAction);
router.get('/pdf/:personal_id', controller.getActionPdf);

module.exports = router;