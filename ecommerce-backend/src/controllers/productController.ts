import { Request } from "express";
import { product } from "../models/products.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from 'fs'
import { myCache } from "../app.js";
import { json } from "stream/consumers";
import { invalidateCache } from "../utils/cache-revalidate&features.js";

const newProduct = asyncHandler(async(req,res,next)=>{
    let ProductPhotoLocation = req.file?.path;

    try {
const {name , price , stock , category} = req.body;

if([name , price , stock , category].some((f)=>f?.trim()==="")){
    throw new ApiError(400 , "all feilds are required")
}




    if(!ProductPhotoLocation){
        throw new ApiError(400 , "photo path not found")
    }
    
    const alreadyProdutInDb = await product.find({
        $and:[{name },{price}]
    })
    if(alreadyProdutInDb.length > 0){
        throw new ApiError(400 , "product already added in Db with same name and price ")
    }



    
    const newProduct = await product.create({
        name , price , stock , category , photo:ProductPhotoLocation  
    })
    
    if(!newProduct){
        throw new ApiError(400 , "failed to create new product")
    }
    invalidateCache({ product: true, admin: true });
     return res.status(200).json(new ApiResponse(200 ,newProduct ,"product added successfully" ))
} catch (error:any) {
    console.log(error)
    if(ProductPhotoLocation)
    fs.unlinkSync(ProductPhotoLocation)
    next( new ApiError(error))
}

})


//types
interface BaseQuery {
    name?: {
        $regex: string;
        $options: string;
      };
      price?: { $lte: number };
      category?: string;
    }
    interface SearchRequestQuery {
        search?: string;
        sort?: string;
        category?: string;
        price?: string;
        page?: string;
    }


const allproduct = asyncHandler(async(req:Request<{},{},{},SearchRequestQuery>,res,next)=>{
    const {search   , sort , category , price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = 8;
    const skip = (page-1 )* limit; 
    
    const baseQuery:BaseQuery = {};
    if(search){
        baseQuery.name ={
            $regex : search,
            $options :"i"
        }  
    }
    if(price){
        baseQuery.price ={
           $lte: Number(price)
        } 
    }
    if(category){
        baseQuery.category = category;
    }

    const filterProducts = await product.find(baseQuery).sort(sort && {price :sort==="asc" ?1 :-1}).limit(limit).skip(skip);

    const [products , filterproductCount ] =await Promise.all([
        filterProducts ,
        product.countDocuments(baseQuery)
    ])
    const totalPage = Math.ceil(filterproductCount / limit);

    

    res.status(200).json(new ApiResponse(200 , {products,totalPage} ))
})



const latestProduct = asyncHandler(async(req,res,next)=>{
    let  allproduct;
    if(myCache.has("latest-products")){
        allproduct = JSON.parse(myCache.get("latest-products")as string);
    }
    else{
        allproduct = await product.find({}).sort({createdAt:-1}).limit(5)
        myCache.set("latest-products" , JSON.stringify(allproduct))
    }
   

    if(!allproduct){
        throw new ApiError(400 , "error in getting Latest products ")
    }

    res.status(200).json(new ApiResponse(200 , allproduct))
})



const allCategories = asyncHandler(async(req,res,next)=>{
    let allproduct; 

    if(myCache.has("allCategories")){
        allproduct = JSON.parse(myCache.get("allCategories")as string)
    }
    else{
        allproduct = await product.distinct("category")
        myCache.set("allCategories" , JSON.stringify(allproduct))
    }

    if(!allproduct){
        throw new ApiError(400 , "error in getting all Categories")
    }

    res.status(200).json(new ApiResponse(200 , allproduct))
})


const adminallproduct = asyncHandler(async(req,res,next)=>{
    let allproduct; 

    if(myCache.has("adminallproduct")){
        allproduct = JSON.parse(myCache.get("adminallproduct")as string)
    }
    else{
        allproduct = await product.find({})
        myCache.set("adminallproduct" , JSON.stringify(allproduct))
    }

    if(!allproduct){
        throw new ApiError(400 , "error in getting all admin products ")
    }

    res.status(200).json(new ApiResponse(200 , allproduct))
})


const singleProduct =asyncHandler(async(req,res)=>{
 const id = req.params.id;

 if(!id) throw new ApiError(400, "product id not found");
 let singleproduct
 if(myCache.has(`product-${id}`)){
   singleproduct = JSON.parse(myCache.get(`product-${id}`) as string);
 } else {
   singleproduct = await product.findById(id);
   myCache.set(`product-${id}`, JSON.stringify(singleproduct));
}
 

    
 if(!singleproduct)throw new ApiError(400, "product  not fount");

  return res.status(200).json(new ApiResponse(200 , singleproduct , "product found "))
})




const updateProduct = asyncHandler(async(req,res,next)=>{
    
    let photo = req.file?.path;

    try {
        const id = req.params.id

        if(!id)throw new ApiError(200 , "id not found")
const {name , price , stock , category} = req.body;

if([name , price , stock , category].some((f)=>f?.trim()==="")){
    throw new ApiError(400 , "all feilds are required")
}

const oldproduct = await product.findById(id);


if(!oldproduct)
throw new ApiError(200 , "product not found")

if(oldproduct.photo)
fs.unlinkSync(oldproduct.photo)


   oldproduct.name = name;
   oldproduct.price = price;
   oldproduct.stock = stock;
   oldproduct.category = category;
   
   oldproduct.photo = photo;

   await oldproduct.save();
   await invalidateCache({product:true})

   



    

     return res.status(200).json(new ApiResponse(200 ,oldproduct ,"product update successfully" ))
} catch (error:any) {
    if(photo)
    fs.unlinkSync(photo)
    next( new ApiError(error))
}

})


const deleteProduct =asyncHandler(async(req,res)=>{
    const id = req.params.id;
    if(!id)throw new ApiError(400, "product id not fount");
   
    const deleteproduct = await product.findById(id) 

    if(!deleteproduct)throw new ApiError(400, "product  not fount");
    await deleteproduct.deleteOne()
    await invalidateCache({product:true})

     
    
   
     return res.status(200).json(new ApiResponse(200 , deleteproduct , "product deleted "))
   })




export {newProduct , allproduct , latestProduct , allCategories , adminallproduct , singleProduct , updateProduct , deleteProduct}