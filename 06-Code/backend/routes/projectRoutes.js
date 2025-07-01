const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/:id/monitorings', projectController.getProjectMonitorings);
router.get('/search', projectController.searchProjects);
router.get('/:projectId/monitoring-summary', projectController.getLastMonitoring);
router.get('/:projectId/permits', projectController.getProjectPermits);


module.exports = router;