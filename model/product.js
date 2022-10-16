const mongoose = require("mongoose");
const {Schema} = mongoose;
const productSchema = new Schema({
     name:{
        type:String,
        required:[true,"please enter product name "],
        trim:true
     },
     description:{
        type:String,
        required:[true,"please enter description of product"]
     },
     price:{
        type:Number,
        required:[true,"please enter price for product"],
        maxLength:[8,"price cannot exceed 8 character"]

     },
     image:[
        {
            public_id:{
                type:String,
                required:true
            },
            url_id:{
                type:String,
                required:true
            }
        },
     ],
     stocks:{
        type:Number,
        required:[true,"please enter product stocks"],
        default:1
     },
     category:{
     type:String,   
     required:[true,"please select product category"]   
     },
     numberOfReviews:{
        type:Number,
        default:0
     },
     ratings:{
     type:Number,
     required:true,
     default:0
     },
     review:[
        {    
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
                },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:String,
                required:true
            },
            comment:{
                type:String,
                 required:true
            }

        }
     ],
    user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Product = mongoose.model("Product",productSchema)    

module.exports = Product;











