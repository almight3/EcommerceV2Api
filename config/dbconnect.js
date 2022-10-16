const mongoose = require('mongoose');

const connectDataBase = ()=>{
    mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("db connected successfully")
    })
    .catch((error)=>{
        console.log("error while connecting db");
        console.log(error)
    })
};


module.exports = connectDataBase;