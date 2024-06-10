const Message = require('../models/Message');

const saveMessage = async (req, res) => {
    const { name, email, message } = req.body;

    try {
        const newMessage = new Message({
            name,
            email,
            message
        });
        await newMessage.save();
        res.status(200).render('message', {status: 200, message: 'Message saved successfully'});
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(200).render('message', {status: 200, message: 'Error saving message'});
    }
};

module.exports = {
    saveMessage
};
