import axios from "axios";

export  const loginapi  = async (userdata:any)=>{
  try {
    const res = await axios.post("http://localhost:8000/api/v1/user/login", userdata);
     return (res.data)
  
  } catch (error) {
    console.log(error)
    throw error
  }


}