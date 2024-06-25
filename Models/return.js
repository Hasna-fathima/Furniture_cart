import mongoose from 'mongoose';
 const returnSchema=new mongoose.Schema(
    {
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        orderid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"order"
        },
        productid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
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