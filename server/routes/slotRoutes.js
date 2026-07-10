const express = require('express');
const router = express.Router();
const { getSlots, getSlotsByTemple, createSlot, updateSlot, deleteSlot, generateSlots } = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/auth');
const { validate, slotSchema } = require('../validations/schemas');

router.route('/')
  .get(getSlots)
  .post(protect, authorize('admin'), validate(slotSchema), createSlot);

router.post('/generate', protect, authorize('admin'), generateSlots);

router.route('/temple/:templeId')
  .get(getSlotsByTemple);

router.route('/:id')
  .put(protect, authorize('admin'), updateSlot)
  .delete(protect, authorize('admin'), deleteSlot);

module.exports = router;
