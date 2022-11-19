const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../model/user");
var jwt = require('jsonwebtoken');
const sendToken = require("../utils/sendToken");


const authenticateUser = asyncErrorHandler(async (req,res,next)=>{
const token = req.headers.authorization
console.log(token)
if (!token) {
      return next(new ErrorHandler("Please Login to access this resource", 401));
    }
  
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    req.user = await User.findById(decodedData.id);
    console.log("inside",req.user)
  
    next();
    
    })

const authorizeUser = (...roles)=>{
 return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        next (new ErrorHandler( `Role: ${req.user.role} is not allowed to access this resouce `,
        403));
    };
    next();
 }
};


module.exports = {authorizeUser,authenticateUser};