import  { useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { GoogleAuthProvider , signInWithPopup  } from 'firebase/auth';
import { auth } from '../firebase';
import { loginapi } from '../api/userapi';


const login = () => {


    const [gender , setgender] = useState("");
    const [date , setdate] = useState("");


    const loginhandler = async()=>{
      const googleprovider = new GoogleAuthProvider();
      const {user} = await signInWithPopup(auth , googleprovider)
      
      if (user) {
        const userRes = {
          _id: '123',
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
          role: 'user',
          gender: 'male', // Example value, replace with actual gender
          dob: '1988-10-02', // Example value, replace with actual date of birth
        };
  
        const newuser = await loginapi(userRes);
      }
    }

  return (
    <div className='login'>
   <main>
    <h1 className='heading'>Login</h1>
    <div>
        <label >Gender</label>
        <select name="gender" value={gender} id="gender" onChange={(e)=>setgender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>

    </div>

    <div>
        <label >Date of Birth</label>
        <input type="date" name="date" id="" value={date} onChange={(e)=>setdate(e.target.value)} />
        
    </div>
    <div>
        <p> already sign in once</p>
        <button onClick={loginhandler}><FcGoogle/><span>GOOGLE</span></button>
    </div>
   </main>
   </div>
  )
}

export default login