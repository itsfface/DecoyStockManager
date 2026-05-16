import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    SKU: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

export const Product = mongoose.model("Product", productSchema)