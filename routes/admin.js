const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();

router.post('/login', adminController.login)

router.get('/products', adminController.getAllProducts);
router.post('/products', adminController.addProduct);
router.get('/products/:id', adminController.getProduct);
router.patch('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

router.get('/messages', adminController.getAllMessages);
router.delete('/messages/:id', adminController.deleteMessage);

router.get('/orders', adminController.getOrders);
router.patch('/orders/:id', adminController.updateOrderStatus);
router.delete('/orders/:id', adminController.deleteOrder);

module.exports = router;