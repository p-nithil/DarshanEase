const express = require('express');
const router = express.Router();
const { getTemples, getTempleById, createTemple, updateTemple, deleteTemple } = require('../controllers/templeController');
const { protect, authorize } = require('../middleware/auth');
const { validate, templeSchema } = require('../validations/schemas');

router.route('/')
  .get(getTemples)
  .post(protect, authorize('admin'), validate(templeSchema), createTemple);

router.route('/:id')
  .get(getTempleById)
  .put(protect, authorize('admin'), validate(templeSchema), updateTemple)
  .delete(protect, authorize('admin'), deleteTemple);

module.exports = router;
