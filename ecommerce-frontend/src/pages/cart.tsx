import  { useEffect, useState } from 'react'
import {  VscError } from 'react-icons/vsc';
import Cartitem from '../components/cart-item';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  addtocart,
  calculatePrice,
  discountApplied,
  removefromcart,
} from "../store/cartslice";
import { useDispatch } from 'react-redux';
import { CartItem } from '../types/types';


const cart = () => {

  const {cartItems , subtotal , tax , total , shippingCharges , discount }=
  useSelector((state:any)=> state.cartSlice)

  const [Coupon , setCoupon] = useState("")
  const [isValidCoupon , setIsValidCoupon] = useState(false)
  
  const dispatch = useDispatch()

  const incHandler = (cartItem:CartItem)=>{
    if(cartItem.quantity>= cartItem.stock )return
    dispatch(addtocart({...cartItem , quantity: cartItem.quantity +1 }));
  }

  const decHandler =(cartItem : any)=>{
   if(cartItem.quantity <=1)return;
   dispatch(addtocart({...cartItem , quantity:cartItem.quantity-1 }))
  }

  const removeHandler = (productId: string) => {
    dispatch(removefromcart(productId));
  };

  

   



  return (
    <div className='cart'>
       <main>
        {cartItems.length > 0 ? (
          cartItems.map((i:any, idx:number) => (
            <Cartitem
              incrementHandler={incHandler}
              decrementHandler={decHandler}
              removeHandler={removeHandler}
              key={idx}
              cartItem={i}
            />
          ))
        ) : (
          <h1>No Items Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal : {subtotal}</p>
        <p>Shiping Charges : {shippingCharges}</p>
        <p> Tax :{tax}</p>
        <p>Discount - <em>
          Rs. {discount}
          </em></p>

          <p><b>Total : {total}</b></p>
          <input type="text" name="Coupon" placeholder={"Coupon code"} value={Coupon} onChange={(e)=>setCoupon(e.target.value)}/>
          {
            Coupon && (isValidCoupon? <span>Rs {discount} of using the <code>{Coupon}</code> </span>:
            <span>invalid Coupon <VscError/></span>)
          }


{
  cartItems.length > 0 && <Link to='/shipping'>Checkout</Link>
}
      </aside>
    </div>
  )
}

export default cart