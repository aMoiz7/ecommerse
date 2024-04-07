import { useState } from "react"
import Productcart from './../components/product-card';

const Search = () => {
  const [search , setsearch] = useState("");
  const [sort , setsort] = useState("")
  const [maxprice, setmaxprice] = useState(10000);
  const [category , setcategory] = useState("");
  const [page , setpage] = useState(1);

  const prouductHandler = ()=>{}
  const isprevpage = false;
  const isnextpage =false;
  

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filter</h2>
        <div>
          <h4>sort</h4>
          <select name="sort"  value={sort} id="sort" onChange={(e)=>setsort(e.target.value)}> 
          <option value="">None</option>
          <option value="asc">price (low to high)</option>
          <option value="dsc">price (high to low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price : {maxprice ||  "" } </h4>
          <input type="range" min={100} max={10000} value={maxprice} onChange={(e)=>setmaxprice(Number(e.target.value))} />
        </div>

        <div>
          <h4>Category</h4>
          <select name="categort"  value={category} id="category" onChange={(e)=>setcategory(e.target.value)}> 
          <option value="">All</option>
          <option value="">sample 1</option>
          <option value="">sample 2</option>

          </select>
        </div>


      </aside>
      <main>
        <h1>products </h1>
        <input type="text" placeholder="Search by name..."  name="search" value={search} id="search" onChange={(e)=>setsearch(e.target.value)} />
        <div className="search-product-list">
        <Productcart productId="assd"  name="mobile" price={20145} stock={2} handler={prouductHandler} photo={"https://media.croma.com/image/upload/v1708678829/Croma%20Assets/Communication/Mobiles/Images/300822_0_vy3iid.png"}/>
        </div>

        <article>
          <button disabled={!isprevpage} onClick={() => setpage((prev)=>prev-1)}>prev</button>
          <span>{page} of {4} </span>
          <button disabled={!isnextpage} onClick={()=>setpage((prev)=>prev+1)}>next</button>
        </article>
      </main>
    </div>
  )
}

export default Search