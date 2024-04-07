import { Link } from "react-router-dom"
import  Productcart  from '../components/product-card';
const Home = () => {


  const prouductHandler = ()=>{
    
  }
  return (
    <div className="home">
      <section> </section>
        <h1>Latest Product
          <Link to="/search" className='findmore'>More</Link>
        </h1>
      
      <main>
          <Productcart productId="assd"  name="mobile" price={20145} stock={2} handler={prouductHandler} photo={"https://media.croma.com/image/upload/v1708678829/Croma%20Assets/Communication/Mobiles/Images/300822_0_vy3iid.png"}/>
          </main>
    </div>
  )
}

export default Home