import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import userModel from '../../Models/Usermodel.js';
import Order from '../../Models/ordermodel.js';
import Product from '../../Models/prodectmodel.js';
import {Address} from '../../Models/Address.js'
import mongoose from 'mongoose'
import Return from '../../Models/return.js';

dotenv.config();



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const addOrder = async (req, res) => {
  const { userId, addressId, products } = req.body;

  try {
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    const orderProducts = await Promise.all(products.map(async (product) => {
      const productDoc = await Product.findById(product.productId);
      if (!productDoc) {
        throw new Error(`Product with ID ${product.productId} not found`);
      }
      const productPrice = productDoc.price;
      const offerPercentage = productDoc.offerPercentage || 0;
      const discountedPrice = productPrice - (productPrice * offerPercentage) / 100;

      return {
        productId: product.productId,
        name: productDoc.name,
        description: productDoc.description,
        price: discountedPrice,
        quantity: product.quantity,
      };
    }));

    // Calculate total amount for the order
    let totalAmount = orderProducts.reduce((acc, product) => acc + (product.price * product.quantity), 0);

    // Create a new order
    const newOrder = new Order({
      user: userId,
      addressId: addressId,
      totalAmount: totalAmount,
      items: orderProducts.map(item => ({
        productId: item.productId,
        payablePrice: item.price,
        purchasedQty: item.quantity,
      })),
      paymentStatus: 'pending',
      paymentType: 'Razorpay',
      orderStatus: [{ type: 'ordered', date: new Date(), isCompleted: true }],
     });

    const savedOrder = await newOrder.save();

  
    const razorpayOptions = {
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // Update order with payment details
    savedOrder.paymentDetails = {
      razorpayOrderID: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
    };

    await savedOrder.save();

    const response = {
      orderId: savedOrder._id,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      address: {
        addressId: address._id,
        state: address.state,
        city: address.cityDistrictTown,
        mobileNumber:address.mobileNumber
      
      },
      products: orderProducts,
      paymentStatus: savedOrder.paymentStatus,
      paymentType: savedOrder.paymentType,
      orderStatus: savedOrder.orderStatus, 
      razorpayOrderID: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};





const verify=async(req,res)=>{
  try {
		const {razorpay_order_id, razorpay_payment_id, razorpay_signature } =
			req.body;
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
			.update(sign.toString())
			.digest("hex");

		if (razorpay_signature === expectedSign) {
			return res.status(200).json({ message: "Payment verified successfully" });
		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
}




const getOrders = async (req, res) => {
  console.log('getOrders function invoked');
  try {
    const orders = await Order.find().exec();
    console.log('Fetched Orders:', orders);

    const processedOrders = [];

    for (let order of orders) {
      try {
        console.log(`Processing order with ID: ${order._id}`);

        const user = await userModel.findById(order.user).exec();
        if (!user) {
          console.error(`User with ID ${order.user} not found`);
          continue;
        }
        console.log('Fetched User:', user);

        const address = await Address.findById(order.addressId).exec();
        if (!address) {
          console.error(`Address with ID ${order.addressId} not found`);
          continue;
        }
        console.log('Fetched Address:', address);

        const orderProducts = [];
        for (let item of order.items) {
          const product = await Product.findById(item.productId).exec();
          if (!product) {
            console.error(`Product with ID ${item.productId} not found`);
            continue;
          }
          console.log('Fetched Product:', product);

          orderProducts.push({
            productId: product._id,
            name: product.name,
            description: product.description,
            price: item.payablePrice,
            quantity: item.purchasedQty,
          });
        }

        const detailedOrder = {
          orderId: order._id,
          user: {
            userId: user._id,
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            phoneNumber: user.phoneNumber,
          },
          address: {
            addressId: address._id,
            name: address.name,
            mobileNumber: address.mobileNumber,
            pinCode: address.pinCode,
            locality: address.locality,
            address: address.address,
            cityDistrictTown: address.cityDistrictTown,
            state: address.state,
            landmark: address.landmark,
            alternatePhone: address.alternatePhone,
            addressType: address.addressType,
          },
          products: orderProducts,
          totalAmount: order.totalAmount,
          paymentStatus: order.paymentStatus,
          paymentType: order.paymentType,
          createdAt: order.createdAt,
        };

        processedOrders.push(detailedOrder);
      } catch (error) {
        console.error(`Error processing order with ID ${order._id}:`, error.message);
      }
    }

    console.log('Processed Orders:', processedOrders);
    res.status(200).json(processedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const orderview=async(req,res)=>{

    const { userId } = req.params;
  
    try {
      const orders = await Order.find({ user: userId }).populate('items.productId', 'name description price imagePublicId');
  
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: 'No orders found for this user' });
      }
  
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }





const updateOrderstatus= async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const validStatus = ['ordered', 'packed', 'shipped', 'delivered', 'returned', 'returnRequested', 'requestAccepted', 'requestRejected'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    
    let foundStatus = false;
    order.orderStatus.forEach(statusObj => {
      if (statusObj.type === status) {
        statusObj.isCompleted = true;
        statusObj.date = new Date();
        foundStatus = true;
      } else {
        statusObj.isCompleted = false
      }
    });

    if (!foundStatus) {
      
      order.orderStatus.push({
        type: status,
        date: new Date(),
        isCompleted: true,
      });
    }

    // Save updated order
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: error.message });
  }
};



const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.body.orderId })
      .populate("items.productId", "_id")
      .lean()
      .exec();

    if (!order) return res.status(404).json({ error: "Order not found" });

    const address = await Address.findOne({ user: req.user._id }).exec();
    if (!address) return res.status(404).json({ error: "Address not found" });

    order.addressId= Address.addressId.find(
      (adr) => adr._id.toString() === order.addressId.toString()
    );

    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




const orderReturn = async (req, res) => {
  const { userid, orderid, productid, reason } = req.body;
  console.log('Request body:', req.body);

  try {
    if (!userid || !orderid || !productid || !reason) {
      return res.status(400).json({ message: 'User ID, Order ID, Product ID, and Reason are required' });
    }
    const [user, order, product] = await Promise.all([
      userModel.findById(userid).exec(),
      Order.findById(orderid).exec(),
      Product.findById(productid).exec()
    ]);

    if (!user || !order || !product) {
      return res.status(404).json({ message: 'User, order, or product not found' });
    }
    const newReturnRequest = new Return({
      userid,
      orderid,
      productid,
      reason:reason ||'',
      status: 'requested'
    });
    const savedReturnRequest = await newReturnRequest.save();

    await savedReturnRequest
      .populate('userid', '_id name email')
      .populate('productid', '_id name')
      .execPopulate();
    const response = {
      message: 'Return request submitted successfully',
      return: {
        _id: savedReturnRequest._id,
        userid: {
          _id: user.toObject()._id,
          details: {
            name: user.toObject().name,
            email: user.toObject().email
          }
        },
        orderid: {
          _id: order.toObject()._id,
          details: {}
        },
        productid: {
          _id: product.toObject()._id,
          details: {
            name: product.toObject().name
          }
        },
        reason: savedReturnRequest.reason,
        status: savedReturnRequest.status,
        createdAt: savedReturnRequest.createdAt,
        updatedAt: savedReturnRequest.updatedAt
      }
    };
    
    res.status(201).json(response);
  } catch (error) {
  
    console.error('Error requesting return:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



  
const requestsResponse = async (req, res) => {
  try {
    const returns = await Return.find()
      .populate('userid', '_id name email')
      .populate('orderid', '_id')
      .populate('productid', '_id name price')
      .exec();

    res.status(200).json({
      message: 'All return requests retrieved successfully',
      returns: returns.map(returnRequest => ({
        _id: returnRequest._id,
        userid: returnRequest.userid
          ? {
              _id: returnRequest.userid._id,
              name: returnRequest.userid.name,
              email: returnRequest.userid.email
            }
          : null,
        orderid: returnRequest.orderid ? returnRequest.orderid._id : null,
        productid: returnRequest.productid
          ? {
              _id: returnRequest.productid._id,
              name: returnRequest.productid.name,
              price:returnRequest.productid.price
            }
          : null,
        reason: returnRequest.reason,
        status: returnRequest.status,
        returnDate: returnRequest.returnDate,
        createdAt: returnRequest.createdAt,
        updatedAt: returnRequest.updatedAt
      }))
    });
  } catch (error) {
    console.error('Error retrieving returns:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const OrderController={addOrder,verify,getOrder,getOrders,orderview,updateOrderstatus,orderReturn,requestsResponse}
export default OrderController
