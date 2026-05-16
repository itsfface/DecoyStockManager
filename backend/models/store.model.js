import mongoose, { Schema } from "mongoose";

const storeSchema = new mongoose.Schema({
  storeName: {
    type: String,
    required: true,
    unique: true
  },
  storeCode: {
    type: String,
    required: true,
    unique: true
  },
  storeAddress: {
    type: String,
    required: true
  },
}, { timestamps: true });

export const Store = mongoose.model("Store", storeSchema)