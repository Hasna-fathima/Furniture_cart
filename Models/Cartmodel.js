import  mongoose from  'mongoose';


const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [
       {       product: { type:mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
               quantity: { type: Number, required: true, default:1},
            
               name: String,
               price: Number,
               
        }
    ]

});



const Cart = mongoose.model('Cart', cartSchema);

export default Cart;