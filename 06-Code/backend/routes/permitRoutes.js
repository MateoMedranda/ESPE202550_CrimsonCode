const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');


router.get('/', permitController.getAllPermits);
router.post('/', permitController.createPermit);
router.put('/:id', permitController.updatePermit);
router.delete('/:id', permitController.deletePermit);
router.get('/projects/:projectId/permissions', permitController.getProjectPermits);

module.exports = router;