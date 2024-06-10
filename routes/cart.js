const express = require("express");
const router = express.Router();
const productController = require('../controllers/productController');
const {requireAuth} = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

router.get('/', requireAuth, (req, res) => res.render('cart.ejs'));
router.post('/', requireAuth, cartController.addToCart);

module.exports = router;