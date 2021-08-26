const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if email and password have been provided e.g from form/postman/insomnia
    if (!email || !password) {
      res.status(404).json({
        status: "fail",
        message: "please provide both email and password",
      });
      return next();
    }
    //check if user exist in database && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({ status: "fail", message: "invalid credentials" });
      return next();
    }

    //check if passwords match...correctPassword() is imported from User model
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
      res.status(400).json({ status: "fail", message: "invalid credentials" });
      return next();
    }

    //if everything is okay send token to client
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: "server error" });
  }
};
