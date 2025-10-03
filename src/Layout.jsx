import "./index.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Sidebar state

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Hamburger button for mobile */}
      {!isOpen && (
        <button className="hamburger" onClick={() => setIsOpen(true)}>
          ☰
        </button>
      )}

      <div className="layout">
        {/* Sidebar */}
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
          {/* Close button only in mobile view */}
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ✖
          </button>

          <h2>Uyirmai</h2>
          <ul className="sidebar-list">
            <li>

              <Link to="dashboard" className="sidebar-link" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="purchase" className="sidebar-link" onClick={() => setIsOpen(false)}>
                Purchase
              </Link>
            </li>
            <li>
              <Link to="inventory" className="sidebar-link" onClick={() => setIsOpen(false)}>
                Add Inventory
              </Link>
            </li>
            <li>
              <Link to="product" className="sidebar-link" onClick={() => setIsOpen(false)}>
                Product
              </Link>
            </li>
            <li>
              <Link to="order" className="sidebar-link" onClick={() => setIsOpen(false)}>
                Order
              </Link>
            </li>
            
            <li>
              <Link to="Orderfulldetails" className="sidebar-link" onClick={() => setIsOpen(false)}>
                order Details
              </Link>
            </li>
          </ul>

          {/* Logout button at bottom */}
          <div className="sidebar-footer">
            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
