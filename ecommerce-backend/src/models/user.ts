import mongoose from "mongoose";

interface Iuser extends Document{
    _id:string;
    email : string;
    name: string;
    photo : string;
    role: "admin" | "user";
    gender: "Male" | "Female";
    dob: Date;
    createdAt :Date;
    updatedAt:Date;
    age:number;

}

const userSchema = new mongoose.Schema({
_id:{
    type:String,
    require:true
},
email:{
type:String,
require:true,
unique:true,
},
name:{
type : String,
require :true
},
photo:{type:String  },
role:{type:String , enum:["admin","user"] , default:"user"},
gender:{type:String , enum:["Male","Female"] , require:true},
dob:{type:Date , require:true},

},{timestamps:true})

userSchema.virtual("age").get(function(){
const today = new Date();
const dob = this.dob;
if (!dob) return null; 
let age = today.getFullYear() - dob.getFullYear();

if(today.getMonth()<dob.getMonth() || today.getMonth()==dob.getMonth() && today.getDate() < dob.getDate()){
    age--;
}
return age;

})

export const user = mongoose.model<Iuser>("User"  , userSchema )
