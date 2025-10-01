/*import "./index.css";
import { Outlet, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <div className="layout">
        <div className="sidebar" id="sidebar">
          <h2>Uyirmai</h2>
          <ul className="sidebar-list">
            <ul className="sidebar-list">
              <li>
                <Link to="dashboard" className="sidebar-link">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="purchase" className="sidebar-link">
                  Purchase
                </Link>
              </li>
              <li>
                <Link to="order" className="sidebar-link">
                  Order
                </Link>
              </li>
              <li>
                <Link to="product" className="sidebar-link">
                  Product
                </Link>
              </li>
            </ul>
          </ul>
          <div className="sidebar-footer">
            <div className="logout-btn">
              <button
                className="btn btn-danger"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;*/
/*
import "./index.css";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="layout">
      
      <button
        className="hamburger"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      
      <div className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
        <h2>Uyirmai</h2>
        <ul className="sidebar-list">
          <li><Link to="dashboard" className="sidebar-link" onClick={() => setIsOpen(false)}>Dashboard</Link></li>
          <li><Link to="purchase" className="sidebar-link" onClick={() => setIsOpen(false)}>Purchase</Link></li>
          <li><Link to="order" className="sidebar-link" onClick={() => setIsOpen(false)}>Order</Link></li>
          <li><Link to="product" className="sidebar-link" onClick={() => setIsOpen(false)}>Product</Link></li>
        </ul>

        <div className="sidebar-footer">
          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

     
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
*/
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
