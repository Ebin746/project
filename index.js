require("dotenv").config();
const express=require("express");
const app=express();
const cookieParser=require("cookie-parser")
const authRoutes=require("./routes/auth");
const dataBaseConnection=require("./MongoDB/dataBase")
app.use(cookieParser());
app.use(express.json());


app.use("/api",authRoutes)
app.use((err, req, res) => {
    console.log("Error caught by middleware:", err);
    const Errorstatus = err.status || 500;
    const Errormessage = err.message || "Some error has detected";
    return res.status(Errorstatus).json({
      status: Errorstatus,
      message: Errormessage,
      success: false,
      stack: err.stack
    });
  });
app.listen(3001,()=>{
    console.log("server started");
    dataBaseConnection()
})