import { ChangeEvent, useState , FormEvent } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { User } from "../../../types/types";
import { useNewProductMutation } from "../../../store/reduxapi/productapi";
import { responseToast } from './../../../utils/features';
import { useNavigate } from "react-router-dom";

const NewProduct = () => {

  const {user } = useSelector((state:any)=>state.userReducer)

  const [newproduct] = useNewProductMutation()
  const navigate = useNavigate()
 



  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [photoPrev, setPhotoPrev] = useState<string>("");
  const [photo, setPhoto] = useState<File>();


  const submithandler= async (e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
     if(!name || !price || !stock || !category || !photo ){
return;
     }

     const formData = new FormData()
     formData.set("name", name)
     formData.set("price", price.toString())
     formData.set("stock", stock.toString())
     formData.set("category", category)
     formData.set("photo",photo)

     const res = await newproduct({id:user?._id! , formData })
     console.log(res)

     responseToast(res,navigate , "/admin/product")

    }


  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoPrev(reader.result);
          setPhoto(file);
        }
      };
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submithandler}>
            <h2>New Product</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoPrev && <img src={photoPrev} alt="New Image" />}
            <button type="submit">Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
