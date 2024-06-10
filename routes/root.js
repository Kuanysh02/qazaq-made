const express = require("express");
const ProductModel = require("../models/Product");
const { saveMessage } = require('../controllers/messageController');
const router = express.Router();

router.route("/").get(async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.status(200).render('index', {mydata: products})
    } catch (error) {
        res.status(404).render('index', {mydata: error.message})
    }
});

router.route("/send-message").post(saveMessage);

module.exports = router;
