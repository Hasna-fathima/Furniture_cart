import mongoose from 'mongoose'


const whishlistSchema=new mongoose.Schema(
    {
        userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        product:[
            {
                productid:{
                    type:mongooseongoos.Schema.Types.ObjectId,
                    ref:"product"
                }
            }
        ]
    }
)
module.exports=mongoose.model('whishlist',whishlistSchema)