import express from "express";
import { createInventory, getInventoryByDate, getInventoryItem, submitInventory} from "../controllers/inventory.controller.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware.js";

const inventoryRouter = express.Router()

inventoryRouter.post('/create-inventory',isLoggedIn,createInventory)
inventoryRouter.post('/update-quantity',isLoggedIn, submitInventory)
inventoryRouter.get('/get-inventory',isLoggedIn, getInventoryItem)
inventoryRouter.get('/',isLoggedIn,getInventoryByDate)

export default inventoryRouter;