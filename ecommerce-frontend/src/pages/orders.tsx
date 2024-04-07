import React, { ReactElement } from 'react'
import TableHOC from '../components/admin/TableHOC'
import { Column } from 'react-table';

type DataType ={
  _id: string;
  amount :number;
  quantity: number;
  discount: number;
  status : ReactElement;
  action : ReactElement;

}
const coloum : Column<DataType>[]=[
    {
    Header:"ID",
    accessor:"_id",
    
},
{
    Header:"Amount",
    accessor:"_id"
},{
    Header:"Quantity",
    accessor:"quantity"
}
    
,{
    Header:"Discount",
    accessor:"discount"
}
,{
    Header:"Amount",
    accessor:"amount"
},{
    Header:"Status",
    accessor:"status"
},{
    Header:"Action",
    accessor:"action"
}
]

const orders = () => {
    const Table = TableHOC<DataType>(coloum ,[],"dashboard-product-box","Orders",true)()
  return (

    <div className='container'>
        <h1>My orders</h1>
        {Table}
    </div>
  )
}

export default orders