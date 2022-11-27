const express = require("express");
const router = express.Router();
const {checkout,paymentVerfication,razorPaykey} = require("../Controller/paymentController.js");
const {authenticateUser} = require("../middleware/auth");

router.route("/checkout").post(authenticateUser,checkout);
router.route("/paymentVerfication").post(paymentVerfication)
router.route("/payment/key").get(authenticateUser,razorPaykey)

module.exports = router;