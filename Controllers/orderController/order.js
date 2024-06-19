import Order from '../../Models/ordermodel.js'
import Cart from "../../Models/Cartmodel.js";
import {Address} from "../../Models/Address.js";
import Product from '../../Models/prodectmodel.js';
import mongoose from "mongoose";
import Offer from '../../Models/offer.js'
import items from "../../Models/ordermodel.js";
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import  Twilio  from "twilio";


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});



dotenv.config()
  const client=Twilio(process.env.ACCOUNT_SID,process.env.AUTH_TOKEN)

const addOrder = async (req, res) => {
  const { userId, addressId, products } = req.body;

  try {
    // Fetch user and address details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Calculate total amount for the order
    let totalAmount = 0;
    for (let product of products) {
      const productDoc = await Product.findById(product.productId);
      if (!productDoc) {
        return res.status(404).json({ error: `Product with ID ${product.productId} not found` });
      }
      const productPrice = productDoc.price;
      const offerPercentage = productDoc.offerPercentage || 0;
      const discountedPrice = productPrice - (productPrice * offerPercentage) / 100;
      totalAmount += discountedPrice * product.quantity;
    }

    // Create a new order
    const newOrder = await Order.create({
      userId,
      addressId,
      products,
      totalAmount
    });

    // Initiate payment with Razorpay
    const razorpayOptions = {
      amount: totalAmount * 100, // amount in paise
      currency: 'INR',
      receipt: `order_${newOrder._id}`
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // Update order with payment details
    newOrder.paymentDetails = {
      razorpayOrderID: razorpayOrder.id,
      amount: razorpayOrder.amount / 100, // amount in rupees
      currency: razorpayOrder.currency
    };
    await newOrder.save();

    res.status(201).json({
      orderId: newOrder._id,
      razorpayOrderID: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};





// Middleware


// POST route for Razorpay webhook
const webHook= (req, res) => {
  const { body } = req;
  const { order_id, payment_id, status } = body.payload.payment.entity;

  // Verify the signature to ensure the request came from Razorpay
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET);
  hmac.update(JSON.stringify(body));
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === req.headers['x-razorpay-signature']) {
    // Signature is valid, process payment status
    if (status === 'captured') {
      // Update order payment status as successful
      Order.findOneAndUpdate(
        { 'paymentDetails.razorpayOrderID': order_id },
        { $set: { paymentStatus: 'Success', 'paymentDetails.payment_id': payment_id } },
        { new: true }
      )
        .then(order => {
          if (!order) {
            return res.status(404).json({ error: 'Order not found' });
          }
          // Handle further actions (e.g., send confirmation email, update inventory)
          res.status(200).send('Payment success');
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.message });
        });
    } else {
      res.status(400).send('Payment failed');
    }
  } else {
    res.status(403).send('Invalid signature');
  }
}






const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select("_id paymentStatus paymentType orderStatus items")
      .populate("items.productId", "_id name productPictures")
      .exec();

    if (!orders) return res.status(404).json({ error: "Orders not found" });

    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};






const updateOrderstatus=async(req,res)=>{
  try{

      const {Id}=req.params;
      const {status}=req.body;

       
    if (!mongoose.Types.ObjectId.isValid(Id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }
    const order=await Order.find({Id})
      if (!order){
        return res.status('order not found')
      }
       const validStatus=['ordered','packed','shipped','delivered','returned','returnRequest'];

             if(!validStatus.includes(status)){
              return res.json({error:'invalid status value'})
             }
    //update the order status
    const UpdateOrderStatus=Order.orderStatus.map((Statusobj)=>{
      if(Statusobj.type === status){
        Statusobj.isCompleted=true;
        Statusobj.date=new Date();
      }
      return Statusobj
    })
    order.orderStatus=UpdateOrderStatus;
    await order.save()
    res.status(200).json(order)
 } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};






const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.body.orderId })
      .populate("items.productId", "_id name productPictures")
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







const orderReturnView=async(req,res)=>{
  try{
    const ReturnedOrder=await Order.find({'orderStatus.type':'returned'})
    .populate({
       path:'user',
       select:'name email'
    })
    .populate({
       path:'items.productId',
       select:'name price'
    })
      .select('user, items');
      if(ReturnedOrder.length === 0){
        return res.status(404).json({message:'no returned orders found'})
      }
      res.status(200).json(ReturnedOrder);
  }catch(error){
    res.status(500).json({error:'an error occured while receiving returned order'})

  }
};





const viewReturnRequest=async(req,res)=>{
  try{
    const returnRequests=await Order.find({'orderStatus.type':'returnRequested'})
    .populate({
       path:'user',
       select:'name email'
    })
    .populate({
       path:'items.productId',
       select:'name price'
    })
      .select('user, items');
      if(returnRequests.length === 0){
        return res.status(404).json({message:'no return requests found'})
      }
      const result=returnRequests.map(order=>({
        user:{
          _id:Order.user._id,
          name:Order.user.name,
          email:Order.user.email
        },
        items:Order.items.map(item=>({
          productId:item.productId._id,
          productName:item.productId.name,
          productPrice:item.productId.price,
          purchaseQtyty:item.productId.quantity,
          productOffer:item.productId.hasOffer
        })),
          totalAmount:order.totalPrice,
          status:order.status
        

        }))

    
      res.status(200).json(result);
  }catch(error){
    res.status(500).json({error:'an error occured while receiving return requests '})

  }
};





 const requestsResponse=async(req,res)=>{
  try{
    const orderId=req.params.orderId
    const status=req.body.status;
    const Order=await Order.findById(orderId).populate('user')
      if(!Order){
        return res.status(404).json('order not found')
    }
   
     //retrieve the mobilenumber form usermodel


     const user=await usermodel.findById(Order.user._id);
     const mobileNumber=user.mobileNumber


     const message=`youre return request for order ${orderId} has been ${status}`;
     await client.messages.create({
      body:message,
      to:mobileNumber,
      from:+19378844980
     })
     console.log(`sms notification sent to ${mobileNumber}: return request ${status}`)
    }catch(error){
      res.status(500).json({error:'an error occured while sending sms '})
  
    }
  };
const OrderController={addOrder,getOrder,getOrders,webHook,updateOrderstatus,orderReturnView,viewReturnRequest,requestsResponse}
export default OrderController
