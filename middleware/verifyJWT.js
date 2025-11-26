const jwt = require("jsonwebtoken");


const verifyJWT = (req , res , next)=>{
  const authHeader = req.headers.authorization || req.headers.Authorization; // bearer value token
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: " unauthorized" });
  }
  const token = authHeader.split(" ")[1]; 
  //split translite from string to array so token =["Bearer","token"]
  jwt.verify(token , process.env.ACCESS_TOKEN_SECRET , (err , decoded ) => {
    if (err) return res.status(403).json({message:"forbidden"});
    req.user_id = decoded.UserInfo;
    next();
  } );
} 
module.exports= verifyJWT;