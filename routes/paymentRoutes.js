const express = require("express");
const router = express.Router();
const {processPayment,sendPaymentApiKey} = require("../Controller/paymentController");
const {authenticateUser} = require("../middleware/auth")

router.route("/payments").post(authenticateUser,processPayment);
router.route('/paymentsapikey').get(authenticateUser,sendPaymentApiKey);

module.exports = router