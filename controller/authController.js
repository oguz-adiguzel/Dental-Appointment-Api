const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create({
      userName: req.body.userName,
      password: req.body.password,
    });
    res.status(201).json({
      message: "Kullanıcı oluşturuldu",
    });
  } catch (error) {
    const errors = validationResult(req);
    console.log("error", error);
    res.status(400).json({
      status: "fail",
      message: errors.array()[0].msg,
    });
  }
};

exports.loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre yanlış" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });

    res.status(200).json({
      token: token,
      message: "Giriş yapıldı",
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
