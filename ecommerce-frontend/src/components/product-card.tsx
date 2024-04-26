import { FaPlus } from "react-icons/fa";
import { CartItem } from "../types/types";

 type ProductsProps ={
    photo : string,
    productId : string,
    name:string,
    price: number,
    stock:number,
    handler: (cartItem: CartItem) => string | any;




 }

 
  const productcart = ({productId , photo , name , price , stock , handler}:ProductsProps) => {

    console.log(photo)
   return (
     <div className="product-card">
     
        <img src={`http://localhost:8000/${photo}`} alt={name} width="200px" />
        <p>{name}</p>
            <span>{price}</span>
            <div>
                <button  onClick={() =>
            handler({ productId, price, name, photo, stock, quantity: 1 })
          }><FaPlus/></button>
            </div>
     </div>
   )
 }

 export default productcart
 