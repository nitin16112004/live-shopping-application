const express = require('express');
const router = express.Router();
const {
  createCheckoutSession,
  createOrder,
  getOrders,
  getOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/checkout', protect, createCheckoutSession);
router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders);

router.get('/:id', protect, getOrder);

module.exports = router;
