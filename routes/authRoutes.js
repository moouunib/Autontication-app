const express = require("express");
const router = express.Router();
const authControl = require("../controllers/authControl");

router.route("/register").post(authControl.register);
router.route("/login").post(authControl.login);
router.route("/refresh").get(authControl.refresh);
router.route("/logout").post(authControl.logout);
module.exports=router;