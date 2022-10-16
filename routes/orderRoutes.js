const express = require("express");
const router = express.Router();
const {createOrder,getSingleOrder,myOrders,getAllOrders} = require("../Controller/orderController");
const {authenticateUser} = require("../middleware/auth");

router.route("/neworder").post(authenticateUser,createOrder);
router.route("/orderdetails").get(authenticateUser,getSingleOrder);
router.route("/myorders").get(authenticateUser,myOrders);

module.exports = router;