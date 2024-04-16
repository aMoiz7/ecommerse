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

  export const calculatePercentage = (thisMonth:number , lastMonth:number )=>{
    if (lastMonth === 0) return thisMonth * 100;
    const percentage = (thisMonth/lastMonth)*100;
    return Number(percentage.toFixed(0))
  }

  export const getInventries = async({categories , productCount}:{categories :any[]  , productCount :number })=>{

    
    const categoriesCount  = await product.aggregate([
      {
        $match:{
          category : {$in: categories}
        },
        
      },{
        $group:{
          _id:"category",
          count:{$sum : 1}
        }
      }
    ])

    const categoryWithPercentage:Record<string , number>[] = [];

    categoriesCount.forEach((category)=>{
      categoryWithPercentage.push({[category._id]:Math.round((category.count / productCount) *100)})
    })

    return categoryWithPercentage;

  }


  interface MyDocument extends Document {
    createdAt: Date;
    discount?: number;
    total?: number;
  }

  type FuncProps = {
    length: number;
    docArr: MyDocument[];
    today: Date;
    property?: "discount" | "total";
  };
  export const getChartData = ({length , today ,docArr , property} :FuncProps)=>{
      const data :  number[] = new Array(length).fill(0); 

      docArr.forEach((i)=>{
        const creationDate = i.createdAt;
        const monthdiff = (today.getMonth()-creationDate.getMonth() +12)%12;

        if(monthdiff<length){
          if(property)data[length-monthdiff-1] +=i[property]!
       
          else data[length-monthdiff-1]+=1;
        }

      })

      return data
  }

  