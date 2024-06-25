import crypto from 'crypto';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import Twilio from 'twilio';
import userModel from '../../Models/Usermodel.js';
import Order from '../../Models/ordermodel.js';
import Product from '../../Models/prodectmodel.js';
import {Address} from '../../Models/Address.js'
import Paymentmodel from '../../Models/Paymentmodel.js';
dotenv.config();

const client = Twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


export const addOrder = async (req, res) => {
  const { userId, addressId, products } = req.body;

  try {
    // Fetch user and address details
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Calculate total amount for the order
    let totalAmount = 0;
    const items = []; // Array to store order items

    for (let product of products) {
      const productDoc = await Product.findById(product.productId);
      if (!productDoc) {
        return res.status(404).json({ error: `Product with ID ${product.productId} not found` });
      }
      const productPrice = productDoc.price;
      const offerPercentage = productDoc.offerPercentage || 0;
      const discountedPrice = productPrice - (productPrice * offerPercentage) / 100;

      // Push item details to items array
      items.push({
        productId: product.productId,
        payablePrice: discountedPrice,
        purchasedQty: product.quantity,
      });

      // Calculate total amount for the order
      totalAmount += discountedPrice * product.quantity;
    }

    // Create a new order
    const newOrder = new Order({
      user: userId,
      addressId: addressId,
      totalAmount: totalAmount,
      items: items,
      paymentStatus: 'pending', 
      paymentType: 'Razorpay', 
    });

    const savedOrder = await newOrder.save();

    
    const razorpayOptions = {
      amount: totalAmount * 100, 
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    
    savedOrder.paymentDetails = {
      razorpayOrderID: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
    };

    
    await savedOrder.save();

    res.status(201).json({
      orderId: savedOrder._id,
      razorpayOrderID: razorpayOrder.id,
      amount: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
    });
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



const OrderController={addOrder,verify,getOrder,getOrders,updateOrderstatus,orderReturnView,viewReturnRequest,requestsResponse}
export default OrderController
