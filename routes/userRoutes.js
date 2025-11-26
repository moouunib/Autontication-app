const express =require("express");
const verifyJWT=  require("../middleware/verifyJWT")
const router = express.Router();
const usersControl = require("../controllers/usersControl")

router.use(verifyJWT);
router.route("/").get(usersControl.getAllUsers);
module.exports= router;