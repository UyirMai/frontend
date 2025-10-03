import axios from "axios";
import React, { useEffect, useState } from "react";

function Orderfulldetails() {
  const [isloading, setIsloading] = useState(true); //lodaing state
  const [ordersdata, setOrdersdata] = useState([]); //state for order data
  const [searchvalue, setSearchvalue] = useState(""); //state to store value from search bar
  const [serachresult, setSearchresult] = useState([]); //state to store search result
  const [isserach,setIssearch]=useState(false);
  const [currentpage, setCurrentpage] = useState(1); //state for current page

  const recordsperpage = 10; //no of records per page
  const token = localStorage.getItem("token");

  const getOrderDetails = async () => {
    try {
      const response = await axios
        .get("https://backend-1-qyp7.onrender.com/loggedin/orderhistory", {
          headers: { Authorization: token },
        })
        .then((res) => {
          setOrdersdata(res.data);
        });
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setIsloading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  //function for search

  const handleSearch = (e) => {
    const value = e.target.value;
        setSearchvalue(value);
    if (value) {
      const result = ordersdata.filter((order) =>
        order.userName.toLowerCase().includes(value.toLowerCase())//after giving order id need to search by orderid
      );
      setSearchresult(result);
      setIssearch(true)
    } else {
      setSearchresult(ordersdata);
    }
  }
  
  
  // Skeleton card (image + 4 shimmering lines)
  const SkeletonCard = () => (
    <div className="card" style={{ width: "18rem" }}>
      <div className="card-body">
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-75"></div>
        <div className="skeleton skeleton-text w-75"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-50"></div>
      </div>
    </div>
  );
  return (
    <>
      <div className="container text-center my-4">
        <h1>order details</h1>
       
      </div>
      <div className="search_div">
        <input
        type="text"
        value={searchvalue}
        onChange={handleSearch}
        placeholder="Search product..."
      />
      </div>
      <div className="row" id="ordersdetails_row">
        {isserach?(serachresult.length > 0 ? (serachresult.map((result)=>(
          <div
            className="col-md-4 d-flex flex-wrap gap-3"
            id="ordersdetails_col"
            key={result._id}
          >
            <div className="card" style={{ width: "18rem" }}>
  <div className="card-body">
    <h5 className="card-text">Order Id: {result.ordernumber}</h5>
    <h5 className="card-title">User Name: {result.userName}</h5>
    <p className="card-text">User Phonenumber: {result.Phone}</p>
    <p className="card-text">User Email: {result.Email}</p>
    <p className="card-text">User Address: {result.address}</p>
    <p className="card-text">Pincode: {result.pincode}</p>

    <h5 className="card-title">Product Details</h5>

    {result.products && result.products.map((product, index) => (
      <div key={index} className="mb-2 p-2 border rounded">
        <p className="card-title">Product Name: {product.name}</p>
        <p className="card-text">Price: {product.price}</p>
        <p className="card-text">Quantity: {product.quantity}</p>
      </div>
    ))}

    <p className="card-text">Total Price: {result.totalPrice}</p>
    <p className="card-text">Order Status: {result.status}</p>
  </div>
</div>

          </div>))):(<div>No orders found</div>)):
        isloading?(
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) :(ordersdata.map((orderdata) => (
          <div
            className="col-md-4 d-flex flex-wrap gap-3"
            id="ordersdetails_col"
            key={orderdata._id}
          >
            <div className="card" style={{ width: "18rem" }}>
  <div className="card-body">
    <h5 className="card-text">Order Id: {orderdata.ordernumber}</h5>
    <h5 className="card-title">User Name: {orderdata.userName}</h5>
    <p className="card-text">User Phonenumber: {orderdata.Phone}</p>
    <p className="card-text">User Email: {orderdata.Email}</p>
    <p className="card-text">User Address: {orderdata.address}</p>
    <p className="card-text">Pincode: {orderdata.pincode}</p>

    <h5 className="card-title">Product Details</h5>

    {orderdata.products && orderdata.products.map((product, index) => (
      <div key={index} className="mb-2 p-2 border rounded">
        <p className="card-title">Product Name: {product.name}</p>
        <p className="card-text">Price: {product.price}</p>
        <p className="card-text">Quantity: {product.quantity}</p>
      </div>
    ))}

    <p className="card-text">Total Price: {orderdata.totalPrice}</p>
    <p className="card-text">Order Status: {orderdata.status}</p>
  </div>
</div>

          </div>
        )))}
        
      </div>
    </>
  );
}

export default Orderfulldetails;
