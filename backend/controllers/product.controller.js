import { Product } from "../models/product.model.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, SKU } = req.body;

        if (!productName || !SKU) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const product = await Product.create({
            productName,
            SKU
        })

        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Failed to add product."
            })
        }

        return res.status(200).json({
            success: true,
            message: "Product added successfully.",
            product
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed in deleteStore controller.",
        });
    }
}

export const removeProduct = async ( req, res) => {
    try {
        const { productId } = req.params;

        if(!productId){
            return res.status(400).json({
                success: false,
                message: "Invalid/Empty product Id."
            })
        }

        const removedProduct = await Product.findByIdAndDelete(productId)

        if(!removedProduct){
            return res.status(400).json({
                success: false,
                message: "Failed to remove product."
            })
        }

        return res.status(200).json({
                success: false,
                message: "Product removed succesfully."
            })

    } catch (error) {
        
    }
}