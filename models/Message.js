// message.model.js
const mongoose = require('mongoose');

// Define the schema for the message collection
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Create the Message model
const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
