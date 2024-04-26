import { Link } from "react-router-dom"
import  Productcart  from '../components/product-card';
import { useLatestProductsQuery } from "../store/reduxapi/productapi";
import { addtocart } from "../store/cartslice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { CartItem } from "../types/types";
const Home = () => {


  const {data , isLoading , isError} = useLatestProductsQuery("")

  const dispatch = useDispatch()

  const addtocarthandler = (cartItem:CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addtocart(cartItem));
    toast.success("Added to cart");
  };
  if(isError) toast.error("cannot fetch the product")
  

  return (
    <div className="home">
      <section> </section>
        <h1>Latest Product
          <Link to="/search" className='findmore'>More</Link>
        </h1>
      
        <main>
        {isLoading ? (
          <h1>Loading...</h1>
        ) : (
          data?.data.map((product:any) => (
            <Productcart
              key={product._id}
              productId={product._id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              handler={addtocarthandler}
              photo={product.photo}
            />
    
          ))
        )}
      </main>
    </div>
  )
}

export default Home