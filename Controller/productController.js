const Product = require("../model/product");
const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apiFeatures")

// create product
const createProduct = asyncErrorHandler(async(req,res,next)=>{
    req.body.user = req.user.id;
    const product = await Product.create(req.body)
    res.json({
        success:true,
        product
    });

});
// get all products 
const getAllProducts = asyncErrorHandler(async(req,res,next)=>{
    let resultPerPage = 4;
    const productCount = await Product.countDocuments()

    let apiFeatures = new ApiFeatures(Product.find(),req.query).search()
    .filter()  
    apiFeatures.pagination(resultPerPage);
    let products = await apiFeatures.query;

    let filteredProductsCount = products.length;
  
    res.status(200).json({
       success:true,
       products,
       productCount,
       resultPerPage,  
       filteredProductsCount
    })
});

// get product details

const getProductDetails = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        new ErrorHandler("Product Not Found",404)
    }
    res.status(200).json({
        success:true,
        product
    })
})



// update product 
const updateProduct = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;   
    let product = await Product.findById(id);
    if(!product){
       return next(new ErrorHandler("Product Not Found",404))
    }  
    product = await Product.findByIdAndUpdate(id,req.body);
    res.status(200).json({
        success:true,
        product
    })

})
// delete product 
const deleteProduct = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Product Not Found",404))
    }
    product.remove();
    res.status(200).json({
    success:true,
    message:"Product Deleted Successfully"
    })
})
// create review 

const createReview = asyncErrorHandler(async(req,res,next)=>{

const {rating,comment,productId} = req.body;

const reviews = {
    user:req.user._id,
    rating:Number(rating),
    comment,
}
      
const product = await Product.findById(productId);

const isReviewed = product.review.find(
    rev=>rev.user.toString() === req.user._id.toString()
)
if(isReviewed){
   product.review.forEach((rev)=>{
    if(rev.user.toString() === req.user._id.toString()){
    (rev.rating=rating)(rev.comment=comment)
    };
   });
}
else{
  product.review.push(reviews);
  product.numberOfReviews = product.length; 
}

let avg = 0;
product.review.forEach((rev)=>{
    avg += rev.rating;
})

product.ratings = avg / product.review.length;

await product.save({ validateBeforeSave: false });

res.status(200).json({
    success:true
});

});

//get all reviews 

const getAllReviews = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.query.id
    const product = await Product.findById(id);

    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    }
    
    res.status(200).json({
        success:true,
        review : product.review
    });

});


// delete review 

const deleteReview = asyncErrorHandler(async(req,res,next)=>{
     const {id} = req.query.id;

     const product = await Product.findById(id);
     
    if (!product) {
        return next(new ErrorHander("Product not found", 404));
    };

    const review = product.review.filter((rev)=>rev.id.toString()!==req.user._id); 
    
    let avg = 0;
    review = review.forEach((rev)=>{
        avg += rev.rating;
    })

    let ratings = 0;

    if(ratings === 0){
        ratings=0;
    }
    else{
        ratings = avg/review.length;
    }
    const numberOfReviews = reviews.length;
    
    await Product.findByIdAndUpdate(id,{
        review,
        ratings,
        numberOfReviews
    },{
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

    res.status(200).json({
        success:true,
    });

});

module.exports = {getAllProducts,createProduct,getProductDetails,updateProduct,deleteProduct,
    createReview,getAllReviews,deleteReview};