import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true,
        minlength : 3,
        maxlength : 20,
    },
    description : {
        type : String,
        required :true,
        trim : true,
        minlength : 10,
        maxlength : 200,
    },
    price : {
        type : Number,
        required : true,
        min : 0,
        max : 1000000,
    },
    category : {
        type : String,
        required : true,
    },
    brand : {
        type : String,
        default : "Generic",
    },
    stock : {
        type : Number,
        required : true,
        min : 0,
        max : 1000,
    },
    images : [
        {
            url : {
                type :String,
                required : true,
            },
        },
    ],
    ratings : {
        type : Number,
        default : 0,
        min : 0,
        max : 5,
    },
    reviews : [
        {
            user : {type : mongoose.Schema.Types.ObjectId, ref : "user"},  
            comment : {type : String, required : true},
            rating : {type : Number, required : true, min : 0, max : 5},          
        },
    ],
},
{timestamps : true}
);

const Product = mongoose.model("product", productSchema);

export default Product;