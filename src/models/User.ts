import mongoose from "mongoose";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
  },
  phone: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 15,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 30,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 250,
    required: true,
  },
  userPicture: {
    type: String,
    default: "",
  },
});

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY as jwt.Secret);
};

export default mongoose.model("user", UserSchema);
