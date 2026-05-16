import express from "express";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";
import { getAdminInventory } from "../controllers/admin.controllers.js";

const adminRouter = express.Router()

adminRouter.get('/get-all-stores', isLoggedIn,isAdmin, getAdminInventory)

export default adminRouter;