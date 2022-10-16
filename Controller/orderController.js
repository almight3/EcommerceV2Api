const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorhandler");
const Order = require("../model/order");

const createOrder =asyncErrorHandler(async(req,res,next)=>{
    const  {shipingInfo,ordersItems,paymentInfo,itemsPrice,
    taxPrice,shipingPrice,totalPrice} = req.body;
    
    const order = await Order.create({
        shipingInfo,ordersItems,paymentInfo,itemsPrice,
        taxPrice,shipingPrice,totalPrice,paidAt:Date.now(),user: req.user._id
    });
    res.status(200).json({
        success:true,
        order
    });
});

// get Single Order

const getSingleOrder = asyncErrorHandler(async(req,res,next)=>{
       const {id} = req.params;
       const order = await Order.findById(id).populate("user","name email");

       if(!order){
         next(new ErrorHandler("order not found for this Id",404));
       };

       res.status(200).json({
        success:true,
        order
       });

});

// get logged in user  Orders
const myOrders = asyncErrorHandler(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    res.status(200).json({
        success:true,
        orders
    });
});


// get all orders -admin 

const getAllOrders = asyncErrorHandler(async(req,res,next)=>{

const orders = await Order.find();

let totalAmount = 0;
orders.forEach((order)=>{
    totalAmount += order.totalAmount;
});

res.status(200).json({
    success:true,
    totalAmount,
    orders
   
   });

});


module.exports = {createOrder,getSingleOrder,myOrders,getAllOrders}