import { NextFunction , Request ,Response} from "express";
import { user } from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const newUser = asyncHandler(
   
  async (req: Request, res: Response ,  next: NextFunction) => {
   try {
     const { _id , email, name, gender, dob } =req.body;



     if(!_id || !email || !name || !gender || !dob){
        throw new ApiError(400 , "all feild are requied " )
     }



     const existingUser = await  user.findOne({$or:[{_id , email}]});

     if(existingUser){
        res.status(200).json(new ApiResponse(201 , `welcome ${existingUser.name}` , "user login" ))
     }


     const Newuser = await user.create({ _id , email, name, gender, dob:new Date(dob)});


     res.status(200).json(new ApiResponse(201 , Newuser , "user created successfully"))

   } catch (error:any) {
      console.log(error,"error")
    next(new ApiError(401, "error in creating new user ", error));}
  }
);


const allUser = asyncHandler(async(req,res,next)=>{

try {
    const Alluser  = await user.find({});
    
    if(!Alluser){
       throw new ApiError(500 , "no user find in db " ,)
    }
    
    res.status(200).json(new ApiResponse(201 , Alluser , "all users"))
} catch (error:any) {
    next(new ApiError(400 , "error in find all users" , error))
}
})


 const getuser = asyncHandler(async(req,res,next)=>{
 try {
      const userid = req.params.userid;
      console.log(userid,"userid")
   
      if(!userid){
       throw new ApiError(400 , " userid not found ");
   }
        const User = await user.findById(userid);
   
        if(!User){
           throw new ApiError(400 , " user not found ");
   
        }
   
        return res.status(200).json(new ApiResponse(200 , User , "user"))
    
 } catch (error:any) {
    next(new ApiError(400 , "error in find  users" , error))

 }
 })

 const deleteuser = asyncHandler(async(req,res,next)=>{
    try {
         const userid = req.params.userid;
      
         if(!userid){
          throw new ApiError(400 , " userid not found ");
      }
           const User = await user.findByIdAndDelete(userid)
      
           if(!User){
              throw new ApiError(400 , " user not found ");
      
           }
      
           return res.status(200).json(new ApiResponse(200 , User , "user delete succesfully" ))
      
    } catch (error:any) {
       next(new ApiError(400 , "error in delete  users" , error))
   
    }
    })

export {newUser , allUser , getuser , deleteuser}