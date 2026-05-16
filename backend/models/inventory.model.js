import mongoose, { Schema } from "mongoose";

const inventorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        min: 0,
      },
    },
  ],
}, { timestamps: true });

inventorySchema.index({ store: 1, date: 1 }, { unique: true });

export const Inventory = mongoose.model("Inventory", inventorySchema)