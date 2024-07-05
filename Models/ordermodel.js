import  mongoose from  'mongoose';
import Product from '../Models/prodectmodel.js';
import { Address} from './Address.js';
import userModel from './Usermodel.js';
import Return from './return.js';


const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        payablePrice: {
          type: Number,
          required: true,
        },
        purchasedQty: {
          type: Number,
          required: true,
        },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      required: true,
    },
    paymentType: {
      type: String,
      required: true,
    },
    offer: { type: Number },
    productPictures: [
      { img: { type: String } }
    ],
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered","returned",'returnRequested','requestAccepted','requestRejected'],
          default: "ordered",
        },
        date: {
          type: Date,
        },
       
        isCompleted: {
          type: Boolean,
          default: false,
        },
        
      },
    ],
  },
  { timestamps: true }
);

const Order= mongoose.model("Order", orderSchema);
export default Order