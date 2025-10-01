import { useEffect, useState } from "react";
import axios from "axios";

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const token = localStorage.getItem("token");

  const getOrderDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/loggedin/orderhistory",
        {
          headers: { Authorization: token },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
        console.log("Orders fetched successfully:", response.data);
      } else {
        console.error("Failed to fetch orders:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, []);

  // Skeleton row
  const SkeletonRow = () => (
    <tr>
      <td>
        <div className="order-skeleton order-skeleton-text w-50"></div>
      </td>
      <td>
        <div className="order-skeleton order-skeleton-text w-75"></div>
      </td>
      <td>
        <div className="order-skeleton order-skeleton-text w-50"></div>
      </td>
      <td>
        <div className="order-skeleton order-skeleton-text w-25"></div>
      </td>
    </tr>
  );

  // --- Pagination logic ---
  let totalPages = 0;
  let currentRecords = [];

  if (orders && orders.length >= 1) {
    totalPages = Math.ceil(orders.length / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    currentRecords = orders.slice(indexOfFirstRecord, indexOfLastRecord);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container-fluid px-3">
      <h1 className="text-center my-3">Order History</h1>

      {/* ✅ Added table-responsive wrapper */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">Sl.NO</th>
              <th scope="col">oder Id</th>
              <th scope="col">Date of Order</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : currentRecords && currentRecords.length > 0 ? (
              currentRecords.map((order, index) => (
                <tr key={order._id}>
                  <td>{(currentPage - 1) * recordsPerPage + index + 1}</td>
                  <td className="text-truncate" style={{ maxWidth: "200px" }}>
                    {order.userName}
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <select
                      className="form-select"
                      value={order.status || "Select"}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        console.log(
                          "Updating status for order:",
                          order._id,
                          "to",
                          newStatus
                        );
                        try {
                          await axios.put(
                            `http://localhost:3000/loggedin/order/${order._id}/status`,
                            { status: newStatus },
                            { headers: { Authorization: token } }
                          );

                          // update state immediately so UI reflects change
                          setOrders((prev) =>
                            prev.map((o) =>
                              o._id === order._id
                                ? { ...o, status: newStatus }
                                : o
                            )
                          );
                        } catch (err) {
                          console.error("Error updating order:", err);
                          alert("Failed to update status");
                        }
                      }}
                    >
                      <option value="Select">Select</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
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
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center flex-wrap">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default Order;
