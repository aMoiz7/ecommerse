import { myCache } from "../app.js";
import { product } from '../models/products.js';


export const invalidateCache =({product ,order, admin ,productId , userId , orderId}:any)=>{
if(product){
    const productkey:string[] = ["allCategories","adminallproduct" , "products"];
    if(typeof productId==="string") productkey.push(`product-${productId}`)
    if(typeof productId==="object") productId.forEach((i:any)=> productkey.push(`product-${i}`))

    
    myCache.del(productkey)
}
if(order){


  
  const orderkey: string[]=["all-orders" , `order-${orderId}` , `my-order-${userId}`]

  myCache.del(orderkey)
}

}


export const reduceStock = async (orderItems: any[]) => {
    for (let i = 0; i < orderItems.length; i++) {
      let order = orderItems[i];
      let reduceProduct = await product.findById(order.productId);
  
      if (!reduceProduct) throw new Error("Product not found to reduce stock");
  
      if(reduceProduct.stock )reduceProduct.stock -= order.quantity;
      await reduceProduct.save();
    }
  }


  