const Order = require('../models/Order');

const createOrder = async (req, res) => {

    try {
        const userId = req.user._id;
        const productId = req.body.id;
        const price = req.body.price;
        const quantity = req.body.hidden_quantity;

        const orderItems = [{
            product: productId,
            quantity: quantity,
            price: price
        }];

        const totalPrice = price * quantity;

        const order = new Order({
            user: userId,
            items: orderItems,
            totalPrice: totalPrice
        });

        await order.save();
        res.redirect('/orders');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderDetails = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;

    try {
        const order = await Order.findOne({ _id: orderId, user: userId }).populate('items.product');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getUserOrders = async (req, res) => {
    const userId = req.user._id;
    try {
        const orders = await Order.find({ user: userId }).populate('items.product');
        res.status(200).render('orders', {orders: orders})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrderDetails,
    getUserOrders
};

