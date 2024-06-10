const ProductModel = require('../models/Product');

module.exports.getAllProducts = async function (req, res) {
    try {
        let products;
        const nameQuery = req.query.name;
        const typeQuery = req.query.type;

        if (nameQuery && typeQuery) {
            products = await ProductModel.find({
                name: { $regex: nameQuery, $options: 'i' }, // Case-insensitive search for name
                type: typeQuery // Exact match for type
            });
        } else if (nameQuery) {
            products = await ProductModel.find({ name: { $regex: nameQuery, $options: 'i' } });
        } else if (typeQuery) {
            products = await ProductModel.find({ type: typeQuery });
        } else {
            products = await ProductModel.find();
        }

        res.status(200).render('products', { product: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.getProduct = async function (req, res) {
    try {
        const product = await ProductModel.findOne({_id: req.params.id}).exec();
        res.status(200).render('detailed', {product: product})
        //res.status(200).json(product)
    } catch(error) {
        res.status(404).render('detailed', {product: error.message})
        //res.status(200).json(error);
    }
}

module.exports.addProduct = async function (req, res) {
    const candidate = await ProductModel.findOne({name: req.body.name});
    if (candidate) {
        res.status(404).json({
            message: 'This product already added'
        })
    } else {
        if (!req.body.name || !req.body.price){
            return res.status(400).json({
                message: "Enter required parameters"
            })
        }
        const product = new ProductModel({
            name: req.body.name,
            price: req.body.price,
            type: req.body.type,
            description: req.body.description,
            productImg: req.body.productImg
        });
        try {
            //console.log(req.body);
            await product.save();
            res.status(201).json(product)
        } catch (err) {
            res.status(404).json({
                message: err.message
            })
        }
    }
}

module.exports.updateProduct = async function(req, res){
    const query = req.params.id;
    await ProductModel.findOneAndUpdate({_id: query}, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        productImg: req.body.productImg,
    }).then(data => {
        //console.log(data);
        //res.status(200).render('message', {status: 200, message: "User updated successfully."});
        res.status(200).json(data);
    }).catch(err => {
        //res.status(200).render('message', {status: 200, message: err.message});
        res.status(500).json(err.message);
    });
}

module.exports.deleteProduct = async function (req, res) {
    await ProductModel.deleteOne({_id: req.params.id}).then(data => {
        if (data.deletedCount === 0) {
            // res.status(404).render('message', {status: 404, message: "Product not found"})
            res.status(404).json("Product not found");
        } else {
            // res.status(200).render('message', {status: 200, message: "Product deleted succesfully!" });
            res.status(200).json("Product deleted succesfully!");
        }
    }).catch(err => {
        res.status(500).render('message', {status: 500, message: err.message});
    });
}

// module.exports.getAllProductsForType = async function (req, res) {
//     try {
//         const products = await ProductModel.find({type: req.params.type});
//         //res.status(200).json(products);
//         res.status(200).render('products', {product: products})
//     } catch(error) {
//         //res.status(404).render('products', {product: error.message})
//         res.status(200).json(error);
//     }
// }
