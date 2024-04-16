import express, { urlencoded } from 'express'
import userRoutes from './routes/user.js'
import productRoute from './routes/products.js'
import orderRoutes from './routes/orders.js'
import {connect} from "./db/index.js"
import NodeCache from 'node-cache'
import adminDash from './routes/stats.js'
import Stripe from 'stripe'
import cors from 'cors'

import { config } from "dotenv";

config({ path: './.env' });





export const stripe = new Stripe("")





const app = express()
app.use(cors({
    origin: '*', // Allow requests from a specific origin
    credentials: true, // Enable sending cookies across origins
  }));
const Port = 8000;
 connect()
export const myCache = new NodeCache()
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json())

app.use("/api/v1/user" , userRoutes )
app.use("/api/v1/product" , productRoute )
app.use("/api/v1/order" , orderRoutes )
app.use("/api/v1/dashboard" , adminDash )



app.listen(Port , ()=>{
    console.log(`post on running in ${Port}`)
})