import  { ChangeEvent, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import {  useNavigate } from 'react-router-dom'

const Shipping = () => {

const [shippingInfo , setShippingInfo] = useState({address:"" , city:"" , state:"" , country:"" , pinCode:""})

const changeHandler=(e:ChangeEvent<HTMLInputElement | HTMLSelectElement> )=>{

    setShippingInfo(prev=>({...prev , [e.target.name]:e.target.value}))
}

const navigate = useNavigate()
  return (
    <div className='shipping'>
        <button className='back-btn' onClick={()=>navigate("/cart")}>
        <BiArrowBack/>
        </button>
      
      <form >
       
       <h1>
        Shipping Address
       </h1>

       <input  required type="text" placeholder='Address' name='address' value={shippingInfo.address}
       onChange={changeHandler} />
        <input  required type="text" placeholder='City' name='city' value={shippingInfo.city}
       onChange={changeHandler} />
        <input  required type="text" placeholder='State' name='state' value={shippingInfo.state}
       onChange={changeHandler} />


      <select name="country"  required value={shippingInfo.country} onChange={changeHandler}>

        <option value="india">india</option>
        <option value="Usa">Usa</option>

      </select>

        <input  required type="number" placeholder='pin code' name='pinCode' value={shippingInfo.pinCode}
       onChange={changeHandler} />

       <button type='submit'>Payment</button>

      </form>

        </div>
  )
}

export default Shipping