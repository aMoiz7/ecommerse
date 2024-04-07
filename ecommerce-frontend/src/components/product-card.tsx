import { FaPlus } from "react-icons/fa";

 type ProductsProps ={
    photo : string,
    productId : string,
    name:string,
    price: number,
    stock:number,
    handler: ()=>void;



 }

 
  const productcart = ({productId , photo , name , price , stock , handler}:ProductsProps) => {
   return (
     <div className="product-card">
        <img src={photo} alt={name} width="200px">
        </img>
        <p>{name}</p>
            <span>{price}</span>
            <div>
                <button onClick={()=>handler}><FaPlus/></button>
            </div>
     </div>
   )
 }

 export default productcart
 