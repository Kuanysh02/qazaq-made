const Product = require("../models/Product");
const Cart = require("../models/Cart");

module.exports.addToCart = async (req, res) => {
    const addedProduct = {
        _id: req.body.productId, 
        type: req.body.type,
        name: req.body.name,
        productImg: req.body.productImg,
        price: req.body.price
    };
    res.render('cart', {product: addedProduct});
}

// const addItem = async (req, res) => {
//     const userId = req.user._id;
//     const { productId, quantity } = req.body;

//     try {
//         let cart = await Cart.findOne({ user: userId });
//         const product = await Product.findById(productId);

//         if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         if (!cart) {
//             cart = new Cart({
//                 user: userId,
//                 items: [{
//                     product: product._id,
//                     quantity: quantity,
//                     price: product.price
//                 }]
//             });
//         } else {
//             const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
//             if (itemIndex > -1) {
//                 cart.items[itemIndex].quantity += quantity;
//             } else {
//                 cart.items.push({
//                     product: product._id,
//                     quantity: quantity,
//                     price: product.price
//                 });
//             }
//         }
//         cart.calculateTotalPrice();
//         await cart.save();

//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// const removeItem = async (req, res) => {
//     const userId = req.user._id;
//     const { productId } = req.body;

//     try {
//         const cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         cart.items = cart.items.filter(item => item.product.toString() !== productId);
//         cart.calculateTotalPrice();
//         await cart.save();

//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// const updateItemQuantity = async (req, res) => {
//     const userId = req.user._id;
//     const { productId, quantity } = req.body;

//     try {
//         const cart = await Cart.findOne({ user: userId });

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
//         if (itemIndex > -1) {
//             cart.items[itemIndex].quantity = quantity;
//         } else {
//             return res.status(404).json({ message: 'Item not found in cart' });
//         }

//         cart.calculateTotalPrice();
//         await cart.save();

//         res.status(200).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// const getCart = async (req, res) => {
//     const userId = req.user._id;

//     try {
//         const cart = await Cart.findOne({ user: userId }).populate('items.product');

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         res.status(200).render('cart', {cart: cart});
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = {
//     addItem,
//     removeItem,
//     updateItemQuantity,
//     getCart
// };
