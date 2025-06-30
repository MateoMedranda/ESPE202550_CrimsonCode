const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');

router.get('/', monitoringController.getAllMonitorings);
router.post('/', monitoringController.createMonitoring);
router.put('/:id', monitoringController.updateMonitoring);
router.delete('/:id', monitoringController.deleteMonitoring);
router.get('/:id/file', monitoringController.getMonitoringFile);

module.exports = router;