import  mongoose from  'mongoose';

const offerSchema = new mongoose.Schema({
    name:{type:String, required:true},
      description:{type:String,required:true},
      price:{type:Number,required:true},
      validUntil:{type:Date,required:true},
      product:[{type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true},]

},
   
 { timestamps: true });


module.exports = mongoose.model('Offer', offerSchema);