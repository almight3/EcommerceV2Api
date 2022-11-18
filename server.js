const express = require('express');
const app = express();
const connectDataBase = require("./config/dbconnect");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const error = require("./middleware/error");
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const ApiFeatures = require('./utils/apiFeatures');
var bodyParser = require('body-parser');
var cors = require('cors')
// dotenv
dotenv.config();
// database connections
connectDataBase();
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(cors())
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1",productRoutes);
app.use("/api/v1",userRoutes);
app.use("/api/v1",paymentRoutes);
app.use("/api/v1",orderRoutes);
app.use(error)




app.listen(process.env.PORT,()=>{
    console.log(`server start at port ${process.env.PORT}`)
})


