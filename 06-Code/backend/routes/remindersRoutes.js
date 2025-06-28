const express = require('express');
const router = express.Router();
const controller = require('../controllers/remindersController');


router.get('/notifications', controller.notifyReminders);
router.get('/data/:reminder_id', controller.getReminderData);

router.get('/', controller.getReminders);
router.get('/:project_id', controller.getRemindersByProject);

router.post('/', controller.postReminder);
router.put('/:reminder_id', controller.putReminder);
router.patch('/:reminder_id', controller.toggleReminderState);

module.exports = router;