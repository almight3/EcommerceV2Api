const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorhandler");
const Razorpay = require('razorpay');
var crypto = require("crypto");
const dotenv = require('dotenv');
dotenv.config();



var instance = new Razorpay({
  key_id:process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_KEY,
})
console.log(process.env.RAZORPAY_ID)
 const checkout = asyncErrorHandler(async(req,res)=>{
  const {amount} = req.body
  var options = {
    amount: Number(amount*100),  
    currency: "INR",
  };
  const order = await  instance.orders.create(options);
  console.log(order)
  res.status(200).json({
    success:true,
    order
  })
});

 const paymentVerfication = asyncErrorHandler(async(req,res,next)=>{
 const {razorpay_order_id ,razorpay_payment_id ,razorpay_signature} = req.body;
 let body=razorpay_order_id + "|" + razorpay_payment_id;
 const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY)
                                 .update(body.toString())
                                 .digest('hex');
                                 console.log("sig received " ,razorpay_signature);
                                 console.log("sig generated " ,expectedSignature);
 
  const isVerfied = expectedSignature === razorpay_signature;
  if(isVerfied){
    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  }
  else{
    return next(new ErrorHandler(400,"payment failed"))
  }
  
});

 const razorPaykey = asyncErrorHandler(async(req,res)=>{
  res.status(200).json({
    success:true,
    id:process.env.RAZORPAY_ID,
    key:process.env.RAZORPAY_KEY
  })
});

module.exports ={checkout,paymentVerfication,razorPaykey}