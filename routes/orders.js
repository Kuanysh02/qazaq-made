const express = require("express");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const {requireAuth} = require("../middleware/authMiddleware");
const router = express.Router();


router.post('/', requireAuth, orderController.createOrder);
router.get('/:id', requireAuth, orderController.getOrderDetails);
router.get('/', requireAuth, orderController.getUserOrders);

module.exports = router;