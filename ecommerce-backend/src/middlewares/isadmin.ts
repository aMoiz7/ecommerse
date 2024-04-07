import { user } from "../models/user.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const isAdmin = asyncHandler(async(req,res,next)=>{
try {
    const userid = req.query.userid;
    console.log(userid)
    if(!userid){
        throw new ApiError(400 , "admin userid not found ");
    }
    const admin = await user.findById(userid);
    if(admin && admin.role === "admin"){
       next();
    }
    else{
        throw new ApiError(400 , "admin not found or invalid admin credentials");
    }
} catch (error:any) {
    res.status(400).json(new ApiError(400 , "" , error))
}
})



export{isAdmin}