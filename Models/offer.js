import  mongoose from  'mongoose';

const offerSchema = new mongoose.Schema({
    title:String,
    discountPercentage: Number,
    startDate: Date,
    endDate: Date,
    image:String,
    
  productId:
         [{type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},]

},
   
 { timestamps: true });


 const Offer = mongoose.model('Offer',offerSchema);
export default Offer
