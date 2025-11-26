const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const register = async (req , res ) =>{
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ message: "All filed are required" });
  }
  const foundUser = await User.findOne({ email }).exec(); //if exist return 1 
  if (foundUser) {
    return res.status(401).json({ message: "user already exist" });
  }

  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedpassword,
  });
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        id: user._id,
      },
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("jwt" , refreshToken , {
    httpOnly:true, //accessible only by web server
    secure : true , //https : in production of course
    samesite : "None",
    maxAGE : 7 * 24 * 60 * 60 * 1000,
  }, );
  res.json({
    accessToken,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  });
}
const login = async (req , res)=>{
  const {email , password } = req.body;
  if(!email || !password ){
    return res.status(400).json({ message: "All filed are required" });
  }
  
  const foundUser = await User.findOne({email}).exec();
  if (!foundUser){
    return res.status(401).json({message :"this user is not found"});
  }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({message : "this password is not correct"});

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https : in production of course
      samesite: "None",
      maxAGE: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      accessToken,
      email: foundUser.email,
    });
}
const refresh = async (req , res)=>{
  console.log("refresh route is down");
  const cookies = req.cookies;
  if(!cookies?.jwt)
    return res.status(401).json({ message: " unauthorized" });
  const refreshToken = cookies.jwt;
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
    if (err) return res.status(403).json({ message: "forbidden" });
    const foundUser = await User.findById(decoded.UserInfo.id).exec();
    if (!foundUser)
      return res.status(401).json({ message: " unauthorized" });
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  });
}
const logout = (req , res) =>{
  const cookies = req.cookies;
  if(!cookies?.jwt)return res.sendStatus(204);//no connect
  res.clearCookie(
    "jwt",
    {
      httpOnly: true, //accessible only by web server
      secure: true, //https : in production of course
      samesite: "None",
      maxAGE: 7 * 24 * 60 * 60 * 1000,
    },
    res.json({ message: "cookie is clear" })
    
  );
  console.log(req.cookies);
}
module.exports = {
  register,
  login,
  refresh,
  logout,
};