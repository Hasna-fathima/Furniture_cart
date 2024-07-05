import mongoose from 'mongoose';
import userModel from './Usermodel.js'
import Product from './prodectmodel.js';
import Order from './ordermodel.js';

const returnSchema = new mongoose.Schema(
  {
  orderid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason:{
      type:String,
      default:"damaged"
      

    },
    productid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    
    },
    
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected'],
      default: 'requested',
    },
    returnDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Return = mongoose.model('Return', returnSchema);
export default Return;