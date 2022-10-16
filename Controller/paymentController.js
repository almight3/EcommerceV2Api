const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const stripe = require('stripe')('sk_test_51LsWNvSA7jorJbwpSd74jTjTiSJtn5MFMekOTM9Tx1MtjGeynDEg0fI0t7HnrADes6cUkCBxwgESDJWnyqw3P7rq00wh8LU5Ay');

//making payments
const processPayment = asyncErrorHandler(async(req,res,next)=>{
      console.log(res.body)
      const payment = await stripe.paymentIntents.create({
        amount: 5000,
        currency: 'inr',
        metadata:{
        company:"ecommerce"
       }
      });
      res.status(200).json({
        success:true,
        client_secret:payment.client_secret
      });
});
// sending stripe apikey

const sendPaymentApiKey = asyncErrorHandler(async(req,res,next)=>{
     console.log("api key")
     res.status(200).json({
        stripeApiKey:process.env.STRIPE_API_KEY
     })
});

module.exports = {sendPaymentApiKey,processPayment}



