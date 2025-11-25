import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true,
        min : 3,
    },
    email : {
        type : String,
        required : true,
        unquie : true,
        lowercase : true,
        trim : true,
    },
    password : {
        type : String,
    },
    provider: {
    type: String,
    default: "manual" 
  }
},
    {timestamps : true}
);

export default mongoose.model("user", userSchema);
