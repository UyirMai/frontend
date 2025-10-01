import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Purchase from "./Purchase";
import Order from "./Order";
import Product from "./Product";
import Login from "./Login";
import Orderfulldetails from "./Orderfulldetails";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/loggedin" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="purchase" element={<Purchase />} />
        <Route path="order" element={<Order />} />
        <Route path="product" element={<Product />} />
        <Route path="Orderfulldetails" element={<Orderfulldetails />} />
      </Route>
    </Routes>
  );
}

export default App;
