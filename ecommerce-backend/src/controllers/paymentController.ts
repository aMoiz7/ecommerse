import { stripe } from "../app.js";
import { couponSchema } from "../models/coupons.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const createPaymentIntent =asyncHandler( async (req,res,next) =>{
  const {amount} = req.body;

  if(!amount)throw new ApiError(400 , "amount not found");

  const paymentIntent = stripe.paymentIntents.create({amount :Number(amount)*100 , currency: "inr"})

  return res.status(201).json({
    success: true,
    clientSecret: (await paymentIntent).client_secret,
  });

})

export const newCoupon = asyncHandler(async(req,res,next)=>{
    const {code ,amount} = req.body;
    if(!code)throw new ApiError(400 , "code required")

    const Coupon = await couponSchema.create({
        code ,
        amount
    })

    if(!Coupon)throw new ApiError(400 , "coupon not reated")

res.status(200).json(new ApiResponse(200 , Coupon))
})


export const Discount = asyncHandler(async(req,res,next)=>{
    const {code} = req.query;
    if(!code)throw new ApiError(400 , "code required")

    const Coupon = await couponSchema.find({code});

    if(!Coupon)throw new ApiError(400 , "coupon invalid")

res.status(200).json(new ApiResponse(200 , Coupon))
})


export const Allcoupons = asyncHandler(async(req,res,next)=>{

    const Coupon = await couponSchema.find({});

    if(!Coupon)throw new ApiError(400 , "coupon not found")

res.status(200).json(new ApiResponse(200 , Coupon))
})



export const DeleteCoupon = asyncHandler(async(req,res,next)=>{
    const {id} = req.params;
    if(!id)throw new ApiError(400 , "code required")

    const deletedCoupon = await couponSchema.findById(id);

    if(!deletedCoupon)throw new ApiError(400 , " invalid id")

     await deletedCoupon.deleteOne()

res.status(200).json(new ApiResponse(200 , deletedCoupon,"coupon deleted "))
})



