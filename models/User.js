const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    required: [true, "Password is required"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      //THIS ONLY WORKS ON SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
    required: [true, "Please confirm your password"],
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } //if password is not modified

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; //not to persist the confirmPassword into the database
  next();
});

//an instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //return true or false
};

const User = mongoose.model("User", userSchema);

module.exports = User;
