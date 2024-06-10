const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    productImg: {
        type: String
    }
});

module.exports =  mongoose.model("Products", productSchema)