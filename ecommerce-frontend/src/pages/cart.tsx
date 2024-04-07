import  { useEffect, useState } from 'react'
import {  VscError } from 'react-icons/vsc';
import Cartitem from '../components/cart-item';
import { Link } from 'react-router-dom';

const cartItem = [
  {
    productId:"asdmsd",
    photo:"mmmm",
    name:"mooo",
    price:3000,
    stock:10,
    quantity:2

  }
];
const Subtotal = 4000;
const tax = Math.round(Subtotal * 0.18);
const shipingCharges = 200;
const total = Subtotal+tax + shipingCharges;
const Discount = 400;
const cart = () => {

  const [Coupon , setCoupon] = useState("")
  const [isValidCoupon , setIsValidCoupon] = useState(false)

useEffect(() => {
  const id = setTimeout(() => {
    if(Math.random()>0.5) setIsValidCoupon(true);
    else setIsValidCoupon(false)
  }, 1000);
  return()=>{
    clearTimeout(id)
    setIsValidCoupon(false)
  }
}, [])


  return (
    <div className='cart'>
      <main>
      
      {cartItem.length > 0 ? cartItem.map((i,idx)=>(
        <Cartitem key ={idx} cartitems={i} />
      )): <h1>No items Added</h1> }

      </main>
      <aside>
        <p>Subtotal : {Subtotal}</p>
        <p>Shiping Charges : {shipingCharges}</p>
        <p> Tax :{tax}</p>
        <p>Discount - <em>
          Rs. {Discount}
          </em></p>

          <p><b>Total : {total}</b></p>
          <input type="text" name="Coupon" placeholder={"Coupon code"} value={Coupon} onChange={(e)=>setCoupon(e.target.value)}/>
          {
            Coupon && (isValidCoupon? <span>Rs {Discount} of using the <code>{Coupon}</code> </span>:
            <span>invalid Coupon <VscError/></span>)
          }


{
  cartItem.length > 0 && <Link to='/shipping'>Checkout</Link>
}
      </aside>
    </div>
  )
}

export default cart