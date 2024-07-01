import mongoose from 'mongoose';
 const returnSchema=new mongoose.Schema(
    {
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        orderid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order"
        },
        productid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        },
        description:{
            type:String
        },
        status:{
            type:String,
            default:"requested"   
        
        }
    }
 )

 const Return = mongoose.model('Return',returnSchema)
  export default Return;