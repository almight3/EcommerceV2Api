const bcrypt = require('bcrypt');
var validator = require('validator');
var jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:[true,"please enter name"],
        maxLenght:[30,"name can nont exceed 30 character"]
    },
    email:{
        type:String,
        required:[true,"please enter email"],
        unique:true,
        validate:[validator.isEmail, "Please Enter a valid Email"],
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"password must be character long"],
        selected:false  
    },
    avatar:{
        public_id:{
            type:String,
        },
        url: {
            type: String,
        },
    },
    role:{
        type:String,
        default:"user"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})


// hasing password
userSchema.pre("save", async function(req,res,next){
    if(!this.isModified("password")){
        next();
    }
this.password = await bcrypt.hash(this.password,10)
})

// genreate jwt
userSchema.methods.generateJWT = function (){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
}

// compare password 
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };
  

const User = mongoose.model("User",userSchema)

module.exports = User;