const express = require("express");
const router = express.Router();
const {getAllProducts,createProduct,getProductDetails,updateProduct,deleteProduct,createReview,getAllReviews,deleteReview} = require("../Controller/productController");
const {authenticateUser,authorizeUser} = require("../middleware/auth")

// product routes
router.route("/products").get(getAllProducts);
router.route("/admin/products/new").post(authenticateUser,authorizeUser("admin"),createProduct);
router.route("/product/:id").get(getProductDetails)
router.route("/admin/products/:id").put(authenticateUser,authorizeUser("admin"),updateProduct).delete(authenticateUser,authorizeUser("admin"),deleteProduct);

// reviews

router.route("/reviews").put(authenticateUser,createReview);

router.route("/reviews").get(getAllReviews)
.delete(authenticateUser,deleteReview);

module.exports = router