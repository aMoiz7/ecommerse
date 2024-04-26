import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useDeleteProductMutation, useProductDetailsQuery, useUpdateProductMutation } from "../../../store/reduxapi/productapi";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { responseToast } from "../../../utils/features";


const Productmanagement = () => {
  const {user} = useSelector((state:any)=>state.userReducer)

 const param = useParams()
 const {data} = useProductDetailsQuery(param.id!)


 const [product , setProduct] = useState({_id:"",photo : "" , category: "" ,name:"" , stock :0 ,price: 0}) 



useEffect(() => {
  if(data){
    setProduct(data.data)
    setNameUpdate(data.data.name)
    setPriceUpdate(data.data.price)
    setStockUpdate(data.data.stock)
    setCategoryUpdate(data.data.category)

  }
  
}, [data])


const { photo , category,name, stock ,price} = product


  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>(photo);
  const [photoFile, setPhotoFile] = useState<File>();


 const [updateProduct] = useUpdateProductMutation()
 const [deleteProduct] = useDeleteProductMutation()


  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const navigate = useNavigate()

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    const formData = new FormData()

    if(nameUpdate) formData.set("name",nameUpdate)
      if(priceUpdate) formData.set("price",priceUpdate.toString())
        if(stockUpdate !== undefined)formData.set("stock",stockUpdate.toString())
          if(photoFile)formData.set("proto",photoFile)
            if(categoryUpdate) formData.set("category",categoryUpdate)


  const res = await updateProduct({formData , userId: user?._id ,productId:data?.data!._id })
  console,log(user?._id , "id")
  responseToast(res, navigate , "/admin/product")
  };

  const deleteHAndler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  const res = await deleteProduct({  userId: user?._id ,productId:data?.data!._id })
  responseToast(res, navigate , "/admin/product")
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <strong>{product._id}</strong>
          <img src={`http://localhost:8000/${photo}`} alt="Product" />
          <p>{name}</p>
          {stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{price}</h3>
        </section>
        <article>
          <button className="product-delete-btn" onClick={deleteHAndler}>
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoUpdate && <img src={photoUpdate} alt="New Image" />}
            <button type="submit">Update</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default Productmanagement;
