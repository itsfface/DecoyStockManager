import express from "express";
import { createStore, deleteStore } from "../controllers/store.controller.js";

const storeRouter = express.Router()

storeRouter.post('/create-store', createStore)
storeRouter.delete('/delete-store/:storeId', deleteStore)


export default storeRouter;