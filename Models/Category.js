import  mongoose, { Mongoose } from  'mongoose';
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      
    },
    image: { type: String },
  
    createdBy: {
      type:String,default:"admin"
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);
export default Category