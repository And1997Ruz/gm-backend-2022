import mongoose from "mongoose";
import { UserSchema } from "../models/User";
import { CategorySchema } from "../models/Category";

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100,
  },
  description: {
    type: String,
    minlength: 5,
    maxlength: 1000,
  },
  price: {
    type: String,
    required: true,
  },
  seller: {
    type: UserSchema,
    required: true,
  },
  category: {
    type: CategorySchema,
    required: true,
  },
  dateOfPost: {
    type: String,
    default: Date.now(),
  },
  itemPicture: {
    type: [String],
    default: [],
  },
});

export default mongoose.model("item", ItemSchema);
