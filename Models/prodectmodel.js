
import  mongoose from  'mongoose';


const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
    },
    reviews: [
        {
            userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
            review: { type: String, required: true }
        }
    ],
    category: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true  
             
    },
    imagePublicId:{
        type:String,
        require:true
    }
   

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product
