const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false });

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

cartSchema.methods.calculateTotalPrice = function() {
    this.totalPrice = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    return this.totalPrice;
};

module.exports = mongoose.model("Carts", cartSchema);
