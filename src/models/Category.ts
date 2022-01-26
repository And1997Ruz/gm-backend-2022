import mongoose from "mongoose";

export const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 20,
  },
  iconPath: {
    type: String,
    required: true,
  },
});

export default mongoose.model("category", CategorySchema);
