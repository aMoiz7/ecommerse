import axios from "axios";

export  const loginapi  = async (userdata:any)=>{
  try {
    console.log(userdata)
    const res = await axios.post("http://localhost:8000/api/v1/user/login", userdata);
     return (res.data)
  
  } catch (error) {
    console.log(error)
    throw error
  }


}


export const getuser = async(id:string)=>{
  try {
    const res   = await axios.get(`http://localhost:8000/api/v1/user/${id}`)
     console.log(res.data,"res")
    return res
  } catch (error) {
     console.error(error)
  }
}