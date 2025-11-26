require("dotenv").config();
const express = require("express");
const connectDB = require("./config/connectDB");
const mongoose = require ("mongoose");
const cookieParser = require("cookie-parser");
const cors = require ("cors");
const path = require("path")
const corsOption =require("./config/corsOptions");
const app = express();

const PORT = process.env.PORT || 5000 ;

connectDB();

app.use(cors(corsOption));
app.use(cookieParser());
app.use(express.json());

app.use("/", express.static(path.join(__dirname, "public")) )
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.use((req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open" , ()=>{
    console.log("connected to mongoDB");
    app.listen(PORT, () => {
        console.log("the number of PORT is :" + PORT);
 });
})
mongoose.connection.on("error" , (error)=>{
    console.log(error);
})