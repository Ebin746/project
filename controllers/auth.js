const UserModel=require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


require("dotenv").config();
const signupUser = async (req, res, next) => {
  try {
    const { email, password, ...other } = req.body;
    let oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new UserModel({
      email,
      password: hashedPassword,
      ...other,
    });
    await user.save();
    let payload={
      user:{id:user._id,
        email:user.email
      }
    }
  const token=jwt.sign(payload,process.env.JWT,{expiresIn:"4h"})
  
  res
  .cookie("access_token", token,{
    httpOnly: true
  })
  .status(200)
 .json({ token,user });
   
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});

    if (!user) {
      return res.status(404).json({ message: "Username not found" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    let payload={
      user:{id:user._id,
        email:user.email
      }
    }
    const token = jwt.sign(payload, process.env.JWT,{expiresIn:"10h"});
   
    res.cookie("access_token", token,{
        httpOnly: true,
      })
      .status(200)
      .json({ token ,user});;
  } catch (error) {
    next(error);
  }
};

module.exports = {
 
  loginUser,
  signupUser
};
