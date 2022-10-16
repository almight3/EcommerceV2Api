const express = require("express");
const router = express.Router();
const {register,login,logoutUser,getSingleUserDetails, updateUserPassword,updateUserProfile,
getAllUser, getUserDetails, updateUserRoles,deleteUser} = require("../Controller/userController")

const {authenticateUser,authorizeUser} = require("../middleware/auth")
// user routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logoutUser);
router.route("/me").get(authenticateUser,getSingleUserDetails);
router.route("/password/update").put(authenticateUser,updateUserPassword);
router.route("/me/update").put(authenticateUser,updateUserProfile);

// admin routes
router.route("/admin/users").get(authenticateUser,authorizeUser("admin"),getAllUser);

router.route("/admin/users/:id")
.get(authenticateUser,authorizeUser("admin"),getUserDetails)
.put(authenticateUser,authorizeUser("admin"),updateUserRoles)
.delete(authenticateUser,authorizeUser("admin"),deleteUser);


module.exports = router