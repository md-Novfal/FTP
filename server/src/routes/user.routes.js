const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth');

router.get('/', authenticate, authorize('admin', 'super_admin'), userController.getAll);
router.post('/', authenticate, authorize('admin', 'super_admin'), userController.create);
router.get('/:id', authenticate, userController.getById);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), userController.remove);

module.exports = router;
