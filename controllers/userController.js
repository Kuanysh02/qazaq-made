const UserModel = require('../models/User');

module.exports.getAllUsers = async function (req, res) {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
        //res.status(200).render('products', {product: products})
    } catch(error) {
        // res.status(404).render('products', {product: error.message})
        res.json(error.message);
    }
}


module.exports.getUser = async function (req, res) {
    try {
        const user = await UserModel.findOne({_id: req.params.id}).exec();
        // res.status(200).render('products', {product: products})
        res.status(200).json(user)
    } catch(error) {
        //res.status(404).render('products', {product: error.message})
        res.status(200).json(error.message);
    }
}

module.exports.deleteUser = async function (req, res) {
    await UserModel.deleteOne({_id: req.params.id}).then(data => {
        if (data.deletedCount === 0) {
            // res.status(404).render('message', {status: 404, message: "Product not found"})
            res.status(404).json("Product not found");
        } else {
            // res.status(200).render('message', {status: 200, message: "Product deleted succesfully!" });
            res.status(200).json("Product deleted succesfully!");
        }
    }).catch(err => {
        res.status(400).json(err);
        // res.status(500).render('message', {status: 500, message: err.message});
    });
}


