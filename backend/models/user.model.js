import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true
  },
  role: {
    type: String,
    enum: ["STORE MANAGER", "ADMIN"],
    default: "STORE MANAGER"
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema)