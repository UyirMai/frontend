import { useEffect, useState } from "react";
import axios from "axios";

function Purchase() {
  const [purchasehistory, setPurchasehistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [product,setProduct]=useState("");
  const[quantity,setQuantity]=useState();
  const[supplier,setSupplier]=useState("");
  const[price,setPrice]=useState();
  const [category,setCategory]=useState("");
const [size, setSize] = useState("");
const [color, setColor] = useState("");
const [quantityType, setQuantityType] = useState("");
const [foodVariant, setFoodVariant] = useState("");



 

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const token = localStorage.getItem("token");

  const getPurchaseDetails = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/loggedin/purchasehistory",
          { headers: { Authorization: token } }
        );
        if (response.data) {
          setPurchasehistory(response.data);
          console.log("Purchase fetched successfully:", response.data);
        } else {
          console.error("Failed to fetch purchase:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching purchase details:", error);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    getPurchaseDetails();
  }, []);

 

  const handleAddPurchase = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProduct("");
      setQuantity("");
      setSupplier("");
      setPrice("");
      setCategory("");
      setColor("");
      setSize("");
      setFoodVariant("")
    //setNewPurchase({ product: "", quantity: "", category: "" });
  };

 
 
const newPurchase = {
  product,
  category,
  quantity,
  supplier,
  price,
  ...(category === "Wear" && { size, color }),
  ...(category === "Food" && { quantityType, foodVariant: `${foodVariant}` }),
};
console.log("New Purchase Object:", newPurchase);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(typeof(newPurchase.quantity))  
     console.log(typeof(newPurchase.price)) 
    try {
      const response = await axios.post(
        "http://localhost:3000/loggedin/purchase",
        newPurchase,
        { headers: { Authorization: token } }
      );

     if (response.data) {
      handleCloseModal();
      getPurchaseDetails();
      setProduct("");
      setQuantity("");
      setSupplier("");
      setPrice("");
      setCategory("");
      setColor("");
      setSize("");
      setFoodVariant("")
    } else {
      console.error("Failed to add purchase:", response.data.message);
    }
    } catch (error) {
      console.error("Error adding purchase:", error);
    }
  };

  const PurchaseSkeletonRow = () => (
    <tr>
      <td><div className="purchase-skeleton purchase-skeleton-text w-50"></div></td>
      <td><div className="purchase-skeleton purchase-skeleton-text w-75"></div></td>
      <td><div className="purchase-skeleton purchase-skeleton-text w-50"></div></td>
      <td><div className="purchase-skeleton purchase-skeleton-text w-25"></div></td>
    </tr>
  );

  // --- Pagination logic ---
let totalPages = 0;
let currentRecords = [];

if (purchasehistory && purchasehistory.length >= 1) {
  totalPages = Math.ceil(purchasehistory.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  currentRecords = purchasehistory.slice(indexOfFirstRecord, indexOfLastRecord);
}

const handlePageChange = (page) => {
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};


  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center my-3">
        <h1 className="text-center flex-grow-1">Purchase History</h1>
        <button className="btn btn-primary" onClick={handleAddPurchase}>
          Add Purchase
        </button>
      </div>

      
      {showModal && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Purchase</h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseModal}
          ></button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Product */}
            <div className="mb-3">
              <label className="form-label">Product</label>
              <input
                type="text"
                className="form-control"
                name="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-control"
                required
              >
                <option value="">Select</option>
                <option value="Essentials">Essentials</option>
                <option value="Wear">Wear</option>
                <option value="Food">Food</option>
              </select>
            </div>

            {/* Conditional Fields */}
            {category === "Wear" && (
              <>
                <div className="mb-3">
                  <label className="form-label">Size</label>
                  <input
                    type="text"
                    className="form-control"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <input
                    type="text"
                    className="form-control"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {/*{category === "Food" && (
              <div className="mb-3">
                <label className="form-label">Quantity Type</label>
                <select
                  value={quantityType}
                  onChange={(e) => setQuantityType(e.target.value)}
                  className="form-control"
                  required
                >
                  <option value="">Select</option>
                  <option value="kg">Kilogram</option>
                  <option value="litre">Litre</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
            )}*/}
            {category === "Food" && (
  <>
    <div className="mb-3">
      <label className="form-label">Quantity Type</label>
      <select
        value={quantityType}
        onChange={(e) => setQuantityType(e.target.value)}
        className="form-control"
        required
      >
        <option value="">Select</option>
        <option value="ml">Millilitre (ml)</option>
        <option value="g">Gram (g)</option>

      </select>
    </div>

    <div className="mb-3">
      <label className="form-label">Variant</label>
      <input
        type="number"
        className="form-control"
        value={foodVariant}
        onChange={(e) => setFoodVariant(e.target.value)}
        placeholder={`Enter value (e.g., 500 for ${quantityType})`}
        required
      />
    </div>
  </>
)}


            {/* Quantity */}
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
              />
            </div>

            {/* Supplier */}
            <div className="mb-3">
              <label className="form-label">Supplier Name</label>
              <input
                type="text"
                className="form-control"
                name="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                required
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Purchase Price</label>
              <input
                type="number"
                className="form-control"
                name="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <button type="submit" className="btn btn-success">
              Save Purchase
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
)}

      {showModal && <div className="modal-backdrop fade show"></div>}

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Sl.no</th>
            <th scope="col">supplier Name</th>
            <th scope="col">Product</th>
            <th scope="col">Date of Purchase</th>
            <th scope="col">Quantity</th>
            <th scope="col">Purchase Price</th>
          </tr>
        </thead>
<tbody>
  {loading ? (
    Array.from({ length: 5 }).map((_, i) => <PurchaseSkeletonRow key={i} />)
  ) : currentRecords && currentRecords.length > 0 ? (
    currentRecords.map((purchase, index) => (
      <tr key={purchase._id}>
        <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
        <td>{purchase.Supplier}</td>
        <td>{purchase.product}</td>
        <td>{purchase.date}</td>
        <td>{purchase.Quantity}</td>
        <td>{purchase.Price}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" style={{ textAlign: "center" }}>
        No data available
      </td>
    </tr>
  )}
</tbody>


      </table>

           {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

    </div>
  );
}

export default Purchase;
