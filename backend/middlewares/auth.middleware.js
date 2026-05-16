import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import { User } from "../models/user.model.js"


dotenv.config()

export const isLoggedIn = async (req, res, next) => {
    try {
        const accessToken = req.cookies?.accessToken
        
        if (!accessToken) {
            return res.status(400).json({
                success: false,
                message: "Unauthorised User!"
            })
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
        req.user = decoded

        next()

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        console.log(error);
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const employeeId = req.user.id

        const user = await User.findOne({employeeId})

        if (user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Access denied - Admin Only' });
        }
        next()

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
        console.log(error);
    }
}