const express = require('express');
const router = express.Router();
const permitController = require('../controllers/permitController');
const {verifyToken} = require('../middleware/auth');

router.use(verifyToken);

router.get('/', permitController.getAllPermits);
router.post('/', permitController.createPermit);
router.put('/:id', permitController.updatePermit);
router.delete('/:id', permitController.deletePermit);

module.exports = router;