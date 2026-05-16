import express from 'express';
import dbConnect from "./db/db.js"
import dotenv from 'dotenv'
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import storeRouter from './routes/store.routes.js';
import inventoryRouter from './routes/inventory.routes.js';
import productRouter from './routes/product.routes.js';
import adminRouter from './routes/admin.routes.js';

dbConnect()
dotenv.config()
const app = express()

app.set("trust proxy", 1);

const port = process.env.PORT || 4000

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://decoy-stock-manager-frontend.vercel.app',
      'https://dsm.decoyluxury.com'
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello, i am under the water! and it's working!",
  });
});

app.use('/api/v1/user', userRouter)
app.use('/api/v1/store', storeRouter)
app.use('/api/v1/inventory', inventoryRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/admin', adminRouter)

app.listen(port,()=>{
    console.log(`Server running on PORT ${port}`);
})



export default app;