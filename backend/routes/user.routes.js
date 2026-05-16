import { login, logOut, me, regiser } from "../controllers/auth.controller.js"
import express from "express"
import { isLoggedIn } from "../middlewares/auth.middleware.js"

const userRouter = express.Router()

userRouter.post('/register', regiser)
userRouter.post('/login', login)
userRouter.get('/me',isLoggedIn,me )
userRouter.get('/logout', isLoggedIn, logOut)

export default userRouter;