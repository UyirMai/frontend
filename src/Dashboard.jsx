import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [toedit, setToedit] = useState([]);
  const [searchresult, setSearchresult] = useState([]);
  const [issearch, setIssearch] = useState(false);
  const [searchname, setSearchname] = useState("");
  const [searchvalue, setSearchvalue] = useState(""); //state to store value from search bar

  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(
        "https://backend-1-qyp7.onrender.com/loggedin/dashboard",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.data) {
        setDashboardData(response.data);
      } else {
        console.error("Failed to fetch dashboard data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const handleRemoving = async (id) => {
    try {
      const response = await axios.delete(
        `https://backend-1-qyp7.onrender.com/loggedin/dashboard/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      if (response.data) {
        await fetchDashboardData();
        window.location.reload();
      } else {
        console.error("Failed to remove product:", response.data.message);
      }
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };
  //to handle edit product
  const handleEdit = async (id) => {
    try {
      axios
        .get(`https://backend-1-qyp7.onrender.com/loggedin/product/${id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          setToedit(res.data);
        });

      setShowModel(true);
    } catch (err) {
      console.log(err);
      setShowModel(false);
    }
  };
  //search function
  useEffect(() => {
    if (!searchname.trim()) {
      // If search input is empty → show full data
      setSearchresult(dashboardData);
      setIssearch(false);
    } else {
      const formattedSearch =
        searchname.charAt(0).toUpperCase() + searchname.slice(1).toLowerCase();

      const foundItems = dashboardData.filter((item) =>
        item.product.toLowerCase().includes(searchname.toLowerCase())
      );

      if (foundItems.length > 0) {
        setSearchresult(foundItems);
        setIssearch(true);
      } else {
        setSearchresult([]);
        setIssearch(true);
      }
    }
  }, [searchname, dashboardData]);

  //to close model
  const handleCloseModal = () => {
    setShowModel(false);
    setToedit([]);
  };
  //handle change in model
  const handleChange = (e) => {
    const { name, value } = e.target;
    setToedit({ ...toedit, [name]: value });
  };
  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedProduct = toedit;
    try {
      axios
        .put(
          `https://backend-1-qyp7.onrender.com/loggedin/product/${toedit._id}`,
          { editedProduct },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((res) => {
        })
        .catch((err) => {
          console.log(err);
        });
      setToedit({ product: "", price: "" });
      setShowModel(false);
      fetchDashboardData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchvalue(value);
    if (value) {
      const result = dashboardData.filter(
        (data) => data.product.toLowerCase().includes(value.toLowerCase()) //after giving order id need to search by orderid
      );
      setSearchresult(result);
      setIssearch(true);
    } else {
      setSearchresult(dashboardData);
    }
  };
  //useeffect to check for key and close model
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") handleCloseModal();
    };
    if (showModel) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [showModel]);

  // Skeleton card (image + 4 shimmering lines)
  const SkeletonCard = () => (
    <div className="card" style={{ width: "18rem" }}>
      <div className="skeleton skeleton-img"></div>
      <div className="card-body">
        <div className="skeleton skeleton-text w-75"></div>
        <div className="skeleton skeleton-text w-50"></div>
        <div className="skeleton skeleton-text w-25"></div>
        <div className="skeleton skeleton-text w-100"></div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="search_div">
        <input
          type="text"
          value={searchvalue}
          onChange={handleSearch}
          placeholder="Search product..."
        />
      </div>
      <div className="row" id="dashboard-row">
        <div className="col-md-12 d-flex flex-wrap gap-3" id="dashboard-cards">
          {issearch ? (
            searchresult.length > 0 ? (
              searchresult.map((item) => (
                <div className="card" style={{ width: "18rem" }} key={item._id}>
                  <img
                    src={item.imgUrl}
                    className="card-img-top"
                    alt={item.product}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{item.product}</h5>
                    <p
                      className="card-text"
                      style={{ color: item.Quantity < 20 ? "red" : "black" }}
                    >
                      In Stock: {item.Quantity}
                    </p>

                    <p className="card-text">Price: {item.Price}</p>
                    <div className="btn-div">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoving(item._id)}
                      >
                        Remove
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleEdit(item._id)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h3>No Product Found</h3>
            )
          ) : loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            dashboardData.map((item) => (
              <div className="card" style={{ width: "18rem" }} key={item._id}>
                <div className="card-body">
                  <h5 className="card-title">{item.product}</h5>
                  <p
                    className="card-text"
                    style={{ color: item.Quantity < 20 ? "red" : "black" }}
                  >
                    In Stock: {item.Quantity}
                  </p>
                  {item.foodVariant ? (
                    <p className="card-text">Varient: {item.foodVariant} {item.quantityType}</p>
                  ) : (
                    ""
                  )}
                  <p className="card-text">Price: {item.Price}</p>
                  <p className="card-text">SKU: {item.SKU}</p>
                  <div class="btn-div">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoving(item._id)}
                    >
                      Remove
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEdit(item._id)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModel ? (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product</label>
                    <input
                      type="text"
                      className="form-control"
                      name="product"
                      value={toedit.product}
                      onChange={handleChange}
                      required
                    />
                  </div>
                   <div className="mb-3">
                    <label className="form-label">sku</label>
                    <input
                      type="text"
                      className="form-control"
                      name="SKU"
                      value={toedit.SKU}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="Price"
                      value={toedit.Price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-success">
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default Dashboard;
