const asyncErrorHandler = require("../middleware/asyncErrorHandler");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../model/user");
const sendToken = require("../utils/sendToken");

const register = asyncErrorHandler(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user = await User.create({
        name:name,
        email:email,
        password:password
    }); 
    sendToken(user,201,res);
});

const login = asyncErrorHandler(async(req,res,next)=>{
     const {email,password} = req.body;

     const user = await User.findOne({email:email}).select("+password");
     
     if(!user){
        new ErrorHandler("Invalid username or password",401)
     };
     const isPasswordMatch = await user.comparePassword(password)
     if(!isPasswordMatch ){
        new ErrorHandler("Invalid username or password",401)
     };

     sendToken(user,201,res);
});

const logoutUser = asyncErrorHandler(async(req,res,next)=>{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(200).json({
        success:true,
        message:"user loged out succefully"
      });
}); 


// get user details 
const getSingleUserDetails = asyncErrorHandler(async(req,res,next)=>{
     
    const user = await User.findById(req.user._id);
     res.status(201).json({
        success:true,
        user
    });

});


// update user password 

const updateUserPassword = asyncErrorHandler(async(req,res,next)=>{
  const {oldPassword,newPassword,conformPassword} =  req.body;
  const user = await User.findById(req.user.id).select("+password");
  
  const isPasswordMatch =  user.comparePassword(oldPassword);
  
  if(!isPasswordMatch){
    return next(new ErrorHandler("old password does not incorrect"),400);
  };
  
  if(newPassword !== conformPassword){
      return next(new ErrorHandler("password does not matched"));
  };
  
  user.password = newPassword;
  await user.save();
  
  sendToken(user,201,res);
});

// update user profile 

const updateUserProfile = asyncErrorHandler(async(req,res,next)=>{
   const newUserData = {
    name:req.body.name,
    email:req.body.email
   };

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    
    res.status(200).json({
        success:true,
    });

});

// get all user -admin 
const getAllUser = asyncErrorHandler(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    });
});

// get user details 
const getUserDetails = asyncErrorHandler(async(req,res,next)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
        return next(new ErrorHandler(`user does not exist with id ${id}`)) 
    };
    res.status(200).json({
        success:true,
        user
    });
});

// update user role -admin
const updateUserRoles = asyncErrorHandler(async(req,res,next)=>{
 const {name,email,role} = req.body; 
 const {id} = req.params;

 const newUserData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role
 };

 const user = await User.findByIdAndUpdate(id,newUserData,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
    
  res.status(200).json({
    success:true,
  });  
}); 

// delete user -admin

const deleteUser = asyncErrorHandler(async(req,res,next)=>{
   const {id} =  req.params;
   const user = await User.findById(id);
   
   if(!user){
    return next(new ErrorHandler(`user does not exist witf this id:${id}`))
   };

   await user.remove();

   res.status(200).json({
    success:true,
    message:"user deleted successfully"
   });
   
});


module.exports = {register,login,logoutUser,getSingleUserDetails, updateUserPassword,updateUserProfile,
getAllUser, getUserDetails, updateUserRoles,deleteUser}