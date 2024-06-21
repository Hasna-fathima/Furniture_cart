import mongoose from 'mongoose';
 const messageSchema=new mongoose.Schema(
    {
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'user'
        },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type:Number, required: true },
        message: { type: String, required: true },
    }
 )

 const Message =mongoose.model('Message',messageSchema)
 export default Message