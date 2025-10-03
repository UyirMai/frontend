import { useState } from "react";
import axios from "axios";
import { use } from "react";

function InventoryForm() {
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantityType, setQuantityType] = useState("");
  const [foodVariant, setFoodVariant] = useState("");
  const [sku,setSku]=useState("");

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newInventoryItem = {
      product,
      category,
      sku,
      quantity,
      price,
      ...(category === "Wear" && { size, color }),
      ...(category === "Food" && { quantityType, foodVariant }),
    };

    try {
      const response = await axios.post(
        "https://backend-1-qyp7.onrender.com/loggedin/inventory",
        newInventoryItem,
        { headers: { Authorization: token } }
      );
      if (response.data) {
        // Reset form
        setProduct("");
        setQuantity("");
        setPrice("");
        setCategory("");
        setSku("");
        setSize("");
        setColor("");
        setQuantityType("");
        setFoodVariant("");
      } else {
        console.error("Failed to add inventory:", response.data.message);
      }
    } catch (error) {
      console.error("Error adding inventory:", error);
    }
  };

  return (
    <div className="container my-3">
      <h2>Add Inventory Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Product</label>
          <input
            type="text"
            className="form-control"
            value={product}
            placeholder="Enter product name"
            onChange={(e) => setProduct(e.target.value)}
            required
          />
        </div>
         <div>
          <label className="form-label">sku</label>
        <input
            type="text"
            className="form-control"
            value={sku}
            placeholder="Enter sku"
            onChange={(e) => setSku(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Essentials">Essentials</option>
            <option value="Wear">Wear</option>
            <option value="Food">Food</option>
          </select>
        </div>
       

        {category === "Wear" && (
          <>
            <div className="mb-3">
              <label className="form-label">Size</label>
              <input
                type="text"
                className="form-control"
                value={size}
                placeholder="Enter size (e.g., S, M, L)"
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
                placeholder="Enter color"
                onChange={(e) => setColor(e.target.value)}
                required
              />
            </div>
          </>
        )}

        {category === "Food" && (
          <>
            <div className="mb-3">
              <label className="form-label">Quantity Type</label>
              <select
                className="form-control"
                value={quantityType}
                placeholder="Select quantity type"
                onChange={(e) => setQuantityType(e.target.value)}
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

        <div className="mb-3">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            placeholder="Enter quantity"
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            value={price}
            placeholder="Enter price"
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="btn btn-success">
          Add Inventory
        </button>
      </form>
    </div>
  );
}

export default InventoryForm;
