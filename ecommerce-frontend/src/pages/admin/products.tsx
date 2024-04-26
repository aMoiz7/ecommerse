import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../store/reduxapi/productapi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { userReducer } from './../../store/userslice';
import { RootState } from '@reduxjs/toolkit/query';
import loader from './../../components/loader';
import Loader from "../../components/admin/Loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];




export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};
const Products = () => {

  const { user } = useSelector(
    (state: any) => state.userReducer
  );

  const {isLoading ,isError,error , data} = useAllProductsQuery(user?._id)
  console.log(data,"data")
  const [rows, setRows] = useState<DataType[]>([]);
  
  if(isError) toast.error(error as string)

useEffect(() => {
  if(data)setRows(data?.data.map((i)=>({photo:<img src={`http://localhost:8000/${i.photo}`}/> , name:i.name ,price:i.price , stock:i.stock , action:<Link to={`/admin/product/${i._id}`}>Manage</Link>,})))

}, [data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading?<Loader/>: Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
