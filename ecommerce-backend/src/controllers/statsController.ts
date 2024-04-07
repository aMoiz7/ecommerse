
import { myCache } from "../app.js";
import { OrderSchema } from "../models/orders.js";
import { product } from "../models/products.js";
import { user } from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import moment from "moment";


export const GetDashBoardStats = asyncHandler(async(req,res,next)=>{
let start ={};

 const key = "admin-stats"

 if(myCache.has(key))JSON.parse(myCache.get(key) as string)

 else{
    
    const today = moment()
    console.log(today);


    const startMonthDate = today.startOf("month");
    const MonthendDate = today;

    const lastMonthstartDate = today.subtract(1,"months").startOf("month");
    const lastMonthendDate = today.subtract(1,"months").endOf("month");

    const lastSixAgo = today.subtract(6,"months") 

    const [thisMonthproduct , thisMonthUser , thisMonthOrders , lastMonthproduct , lastMonthUser , lastMonthOrders ]=await Promise.all([
        product.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:startMonthDate,
                        $lte :MonthendDate
                    }
                }
            }
            ,
            {$count:"thisMonthproduct"}
        ]),

        user.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte:startMonthDate,
                        $lte: MonthendDate
                    }
                }
            },{
                $count:"thisMonthUser"
            }
        ]),
        OrderSchema.aggregate([
            {
                $match:{
                    createdAt:{
                       $gte:startMonthDate,
                       $lte:MonthendDate
                    }
                }
            },{
                $count:""
       