const ProductModel = require('../models/Product');
const UserModel = require('../models/User');
const MessageModel = require('../models/Message');
const OrderModel = require('../models/Order');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.OFFICE365_EMAIL, 
        pass: process.env.OFFICE365_PASSWORD 
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

const sendEmail = (email, subject, text) => {
    const mailOptions = {
        from: process.env.OFFICE365_EMAIL,
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
};


module.exports.getAllProducts = async function (req, res) {
	try {
		let products;
		const nameQuery = req.query.name;
		const typeQuery = req.query.type;

		if (nameQuery && typeQuery) {
			products = await ProductModel.find({
				name: { $regex: nameQuery, $options: 'i' }, 
				type: typeQuery
			});
		} else if (nameQuery) {
			products = await ProductModel.find({ name: { $regex: nameQuery, $options: 'i' } });
		} else if (typeQuery) {
			products = await ProductModel.find({ type: typeQuery });
		} else {
			products = await ProductModel.find();
		}
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ error: 'Internal server error' });
	}
}

module.exports.getProduct = async function (req, res) {
	try {
		const product = await ProductModel.findOne({_id: req.params.id}).exec();
		res.status(200).json(product)
	} catch(error) {
		res.status(200).json(error);
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
		res.status(200).json(data);
	}).catch(err => {
		res.status(500).json(err.message);
	});
}

module.exports.deleteProduct = async function (req, res) {
	await ProductModel.deleteOne({_id: req.params.id}).then(data => {
		if (data.deletedCount === 0) {
			res.status(404).json("Product not found");
		} else {
			res.status(200).json("Product deleted succesfully!");
		}
	}).catch(err => {
		res.status(500).json(err);
	});
}

module.exports.getAllUsers = async function (req, res) {
	try {
		const users = await UserModel.find();
		res.status(200).json(users);
	} catch(error) {
		res.status(500).json(error.message);
	}
}

module.exports.getUser = async function (req, res) {
	try {
		const user = await UserModel.findOne({_id: req.params.id}).exec();
		res.status(200).json(user)
	} catch(error) {
		res.status(500).json(error.message);
	}
}

module.exports.updateUser = async function (req, res) {
	await UserModel.findOneAndUpdate({_id: req.params.id}, {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
	}).then(data => {
		res.status(200).json(data);
	}).catch(err => {
		res.status(200).json(err);
	});
}

module.exports.deleteUser = async function (req, res) {
	await UserModel.deleteOne({_id: req.params.id}).then(data => {
		if (data.deletedCount === 0) {
			res.status(404).json("User not found");
		} else {
			res.status(200).json("User deleted succesfully!");
		}
	}).catch(err => {
		res.status(500).json(err);
	});
}

module.exports.getAllMessages = async function (req, res) {
	try {
		const messages = await MessageModel.find();
		res.status(200).json(messages);
	} catch(error) {
		res.status(500).json(error.message);
	}
}

module.exports.deleteMessage = async (req, res) => {
	try {
		const message = await MessageModel.findById(req.params.id);

		if (!message) {
		return res.status(404).json({ message: 'Message not found' });
		}

		await message.remove();
		res.json({ message: 'Message deleted' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports.getOrders = async (req, res) => {
	try {
	  const orders = await OrderModel.find().populate('user').populate('items.product');
	  res.json(orders);
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  };


module.exports.updateOrderStatus = async (req, res) => {
	try {
	  const order = await OrderModel.findById(req.params.id).populate('user');;
  
	  if (!order) {
		return res.status(404).json({ message: 'Order not found' });
	  }
  
	  order.status = req.body.status || order.status;
	  const updatedOrder = await order.save();

		if (order.status === 'Delivered') {
			const subject = 'Order Delivered';
			const text = `Your order with ID ${order._id} has been successfully delivered.`;
			sendEmail(order.user.email, subject, text);
		} else if (order.status === 'Cancelled') {
			const subject = 'Order Cancelled';
			const text = `Your order with ID ${order._id} has been cancelled.`;
			sendEmail(order.user.email, subject, text);
		}

	  res.json(updatedOrder);
	} catch (error) {
	  res.status(400).json({ message: error.message });
	}
  };
  
module.exports.deleteOrder = async (req, res) => {
	try {
	  const order = await OrderModel.findById(req.params.id);
  
	  if (!order) {
		return res.status(404).json({ message: 'Order not found' });
	  }
  
	  await order.remove();
	  res.json({ message: 'Order deleted' });
	} catch (error) {
	  res.status(500).json({ message: error.message });
	}
  };


  module.exports.login = async (req, res) => {
	const { email, password } = req.body;
	if (email === 'admin@mail.com' && password === 'qazaqmade') {
	  const token = jwt.sign({ email }, 'ADMIN_SECRET', { expiresIn: '1h' });
	  return res.json({ token });
	}
	return res.status(401).json({ message: 'Invalid email or password' });
  };