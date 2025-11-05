const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  startRoom,
  endRoom
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getRooms)
  .post(protect, authorize('seller', 'admin'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, authorize('seller', 'admin'), updateRoom)
  .delete(protect, authorize('seller', 'admin'), deleteRoom);

router.post('/:id/start', protect, authorize('seller', 'admin'), startRoom);
router.post('/:id/end', protect, authorize('seller', 'admin'), endRoom);

module.exports = router;
