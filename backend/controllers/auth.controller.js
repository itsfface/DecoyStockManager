import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Store } from "../models/store.model.js";

export const regiser = async (req, res) => {
    const { fullname, employeeId, password, storeCode } = req.body;
    try {
        if (!fullname || !employeeId || !password || !storeCode) {
            res.status(400).json({
                success: false,
                message: "All fields are required."
            })
        }

        const storeId = await Store.findOne({ storeCode })

        const user = await User.create({
            fullname,
            employeeId,
            password,
            store: storeId._id
        })

        const populatedUser = await User.findById(user._id).populate('store');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Failed to Create New User."
            })
        }

        return res.status(200).json({
            success: true,
            message: "User Created Successfully!",
            populatedUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed in register controller."
        })
        console.log(error);
    }
}

export const login = async (req, res) => {
    const { employeeId, password } = req.body;

    try {
        if (!employeeId || !password) {
            res.status(400).json({
                success: false,
                message: "Employee Id and Password required."
            })
        }

        const userExists = await User.findOne({ employeeId }).populate('store')

        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "No User Found."
            })
        }

        if (userExists.password !== password) {
            res.status(400).json({
                success: false,
                message: "Invalid Password."
            })
        }

        const accessToken = jwt.sign({ id: userExists.employeeId, role: userExists.role, storeCode: userExists.store.storeCode, }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".decoyluxury.com",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie('accessToken', accessToken, cookieOptions)

        res.status(200).json({
            success: true,
            message: "Login Successful!",
            accessToken: accessToken,
            user: {
                name: userExists.fullname,
                employeeId: userExists.employeeId,
                store: userExists.store.storeName,
                storeCode: userExists.store.storeCode,
                role: userExists.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed in Log In controller."
        })
        console.log(error);
    }
}

export const me = async (req, res) => {
    try {
        const employeeId = req.user?.id;
        console.log(employeeId);
        console.log(req.user);



        const user = await User.findOne({ employeeId }).select('-password').populate('store')
        console.log(user);


        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "User fetched successfully.",
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in me controller."
        })
        console.log(error);
    }
}

export const logOut = async (req, res) => {
    try {

        res.setHeader("Cache-Control", "no-store");

        res.cookie("accessToken", "", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            domain: ".decoyluxury.com",
            path: "/",
            expires: new Date(0),
            maxAge: 0,
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed in Log Out controller."
        });
    }
}