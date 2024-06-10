const express = require("express");
const productController = require("../controllers/productController");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/add', productController.addProduct);
router.post('/', cartController.addToCart);
router.patch('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;