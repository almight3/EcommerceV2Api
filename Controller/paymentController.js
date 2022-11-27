const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorhandler");
const Razorpay = require('razorpay');
var crypto = require("crypto");
const dotenv = require('dotenv');
dotenv.config();



var instance = new Razorpay({
  key_id:"rzp_test_aFuGXl6epqMAZC",
  key_secret:"vyEDhjBVw0iKcFZqiobwdk7B",
})
console.log(process.env.RAZORPAY_ID)
 const checkout = asyncErrorHandler(async(req,res)=>{
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  res.status(200).json({
    success: true,
    order,
  });
});

const paymentVerfication = asyncErrorHandler(async(req,res,next)=>{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  req.body;
  console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)
const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
  .createHmac("sha256", "vyEDhjBVw0iKcFZqiobwdk7B")
  .update(body.toString())
  .digest("hex");

const isAuthentic = expectedSignature === razorpay_signature;

if (isAuthentic) {

  res.redirect(
    `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
  );
} else {
  res.status(400).json({
    success: false,
  });
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