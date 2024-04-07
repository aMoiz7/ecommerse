import express, { urlencoded } from 'express'
import userRoutes from './routes/user.js'
import productRoute from './routes/products.js'
import orderRoutes from './routes/orders.js'
import {connect} from "./db/index.js"
import NodeCache from 'node-cache'






const app = express()
const Port = 8000;
 connect()
export const myCache = new NodeCache()
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json())

app.use("/api/v1/user" , userRoutes )
app.use("/api/v1/product" , productRoute )
app.use("/api/v1/order" , orderRoutes )


app.listen(Port , ()=>{
    console.log(`post on running in ${Port}`)
})