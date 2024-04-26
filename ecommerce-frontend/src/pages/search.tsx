import { useEffect, useState } from "react";
import ProductCard from "../components/product-card";
import toast from "react-hot-toast";
import { CartItem } from "../types/types";
import { addtocart } from "../store/cartslice";
import { useDispatch } from "react-redux";
import Loader from './../components/loader';
import axios from "axios";
import { SearchProductsResponse } from "../types/api-types";
import { useCategoriesQuery } from "../store/reduxapi/productapi";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [productsData, setProductsData] = useState<SearchProductsResponse | null | any>(null);
  const [loading, setLoading] = useState(false);

  const searchProducts = async () => {
    let base = `http://localhost:8000/api/v1/product/all?search=${search}&page=${page}`;

    if(maxPrice) base += `&price=${maxPrice}`;
    if(sort) base += `&sort=${sort}`;
    if(category) base += `&category=${category}`;

    try {
      setLoading(true);
      const response = await axios.get(base);
      setProductsData(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };


  

  useEffect(() => {
    searchProducts()
  }, [search, sort, maxPrice, category, page]);
  if(productsData && productsData.products.length > 0) {
    console.log(productsData.products[0]._id, "id");
  }

  const {data :categoriesResponse , isLoading : loadingCategories } = useCategoriesQuery("")

  const dispatch = useDispatch();

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addtocart(cartItem));
    toast.success("Added to cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (loading && loadingCategories) {
    return <Loader />;
  }
  return (
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>

        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={200000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <h4>Category</h4>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">ALL</option>
            {!loadingCategories &&
              categoriesResponse?.data?.map((i) => (
                <option key={i} value={i}>
                  {i.toUpperCase()}
                </option>
              ))}
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

<div className="search-product-list">
          {loading? <Loader/> :productsData && productsData?.products.map((i:any) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
              photo={i.photo}
            />
            
          ))
           }
        </div>

        {productsData && productsData?.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {productsData.totalPage}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;