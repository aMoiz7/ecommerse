import React, { useState } from 'react'
import { FaGoogle } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const login = () => {
    const [gender , setgender] = useState("");
    const [date , setdate] = useState("");

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
        <button><FcGoogle/><span>GOOGLE</span></button>
    </div>
   </main>
   </div>
  )
}

export default login