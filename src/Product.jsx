// Product.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchvalue, setSearchvalue] = useState("");
  const [searchresult, setSearchresult] = useState([]);
  const [issearch, setIssearch] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProductData, setEditProductData] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/loggedin/products", {
        headers: { Authorization: token },
      });
      const data = res.data;
      if (Array.isArray(data)) setProducts(data);
      else if (data && typeof data === "object") setProducts([data]);
      else setProducts([]);
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleRemoving = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await axios.delete(`http://localhost:3000/loggedin/product/${id}`, {
        headers: { Authorization: token },
      });
      fetchProducts();
    } catch (err) {
      console.error("Error removing product:", err);
    }
  };

  const handleEdit = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/loggedin/products/${id}`,
        { headers: { Authorization: token } }
      );
      const p = res.data || {};
      setEditProductData(p);
      setShowEditModal(true);
    } catch (err) {
      console.error("Error fetching product for edit:", err);
      alert("Failed to load product for editing.");
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchvalue(value);
    if (!value) {
      setIssearch(false);
      setSearchresult([]);
      return;
    }
    setIssearch(true);
    const result = products.filter((p) =>
      (p.product || p.productname || "")
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setSearchresult(result);
  };

  const SkeletonCard = () => (
    <div className="card" style={{ width: "18rem" }}>
      <div className="skeleton skeleton-img" style={{ height: 200 }} />
      <div className="card-body">
        <div className="skeleton skeleton-text w-75" />
        <div className="skeleton skeleton-text w-50" />
        <div className="skeleton skeleton-text w-25" />
      </div>
    </div>
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Products</h3>
        <div className="search_div" style={{ width: 300 }}>
          <input
            type="text"
            value={searchvalue}
            onChange={handleSearch}
            placeholder="Search product..."
            className="form-control"
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add Product
        </button>
      </div>

      <div className="row">
        {issearch
          ? searchresult.length > 0
            ? searchresult.map((item) => (
                <ProductCard
                  key={item._id || item.productname}
                  item={item}
                  onRemove={handleRemoving}
                  onEdit={handleEdit}
                />
              ))
            : "No product found"
          : loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => (
              <ProductCard
                key={p._id || p.productname}
                item={p}
                onRemove={handleRemoving}
                onEdit={handleEdit}
              />
            ))}
      </div>

      {showAddModal && (
        <AddEditProductModal
          token={token}
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            setShowAddModal(false);
            fetchProducts();
          }}
        />
      )}

      {showEditModal && editProductData && (
        <AddEditProductModal
          token={token}
          mode="edit"
          initialData={editProductData}
          onClose={() => {
            setShowEditModal(false);
            setEditProductData(null);
          }}
          onSaved={() => {
            setShowEditModal(false);
            setEditProductData(null);
            fetchProducts();
          }}
        />
      )}
    </>
  );
}

function ProductCard({ item, onRemove, onEdit }) {
  const displayPrice =
    item.category === "Food" && item.type === "Combo"
      ? item.price
      : item.variants?.[0]?.price ?? item.price;

  const displayMrp =
    item.category === "Food" && item.type === "Combo"
      ? item.Mrp
      : item.variants?.[0]?.mrprice ?? item.Mrp;

  return (
    <div className="col-md-4 mb-3">
      <div className="card" style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{item.product || item.productname}</h5>
          <p className="card-text">Category: {item.category}</p>
          <p className="card-text">
            Price: ₹{displayPrice}{" "}
            {displayMrp && displayMrp > displayPrice && (
              <span className="text-muted text-decoration-line-through">
                ₹{displayMrp}
              </span>
            )}
          </p>
          <div className="btn-div d-flex gap-2">
            <button
              className="btn btn-danger"
              onClick={() => onRemove(item._id)}
            >
              Remove
            </button>
            <button
              className="btn btn-warning"
              onClick={() => onEdit(item._id)}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 AddEditProductModal updated for Food + Combo logic */
function AddEditProductModal({
  token,
  mode = "add",
  initialData = null,
  onClose,
  onSaved,
}) {
  const [previewImage, setPreviewImage] = useState("");
  const [productname, setProductname] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [mrprice, setMrPrice] = useState("");
  const [sku, setSku] = useState("");
  const [defaultImg, setDefaultImg] = useState("");
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [saving, setSaving] = useState(false);
  const [nos,setNos]=useState(0);

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setProductname(initialData.productname || initialData.product || "");
      setDescription(initialData.description || "");
      setCategory(initialData.category || "");
      setType(initialData.type || "Single");
      setPrice(initialData.price ?? "");
      setMrPrice(initialData.Mrp ?? "");
      setSku(initialData.sku || "");
      setDefaultImg(initialData.img || initialData.imgUrl || "");
      setImages(initialData.images || []);
      setVariants(
        Array.isArray(initialData.variants) ? initialData.variants : []
      );
    }
  }, [mode, initialData]);

  const addImage = () => setImages([...images, ""]);
  const updateImage = (i, val) => {
    const next = [...images];
    next[i] = val;
    setImages(next);
  };
  const removeImage = (i) => setImages(images.filter((_, idx) => idx !== i));

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        name: "",
        unit: "",
        quantity: "",
        sku: "",
        mrprice: 0,
        price: 0,
        images: [],
      },
    ]);
  };

  const updateVariant = (i, field, value) => {
    const next = [...variants];
    next[i][field] = value;
    setVariants(next);
  };

  const addVariantImage = (i) => {
    const next = [...variants];
    next[i].images = next[i].images ? [...next[i].images, ""] : [""];
    setVariants(next);
  };

  const updateVariantImage = (i, idx, value) => {
    const next = [...variants];
    next[i].images[idx] = value;
    setVariants(next);
  };

  const removeVariantImage = (i, idx) => {
    const next = [...variants];
    next[i].images.splice(idx, 1);
    setVariants(next);
  };

  const removeVariant = (i) => {
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!productname || !category) return alert("Missing fields");

    setSaving(true);

    const payload = {
      productname,
      product: productname,
      description,
      category,
      type,
      Mrp:
        category === "Food" && type === "Combo" ? Number(mrprice) : undefined,
      price:
        category === "Food" && type === "Combo" ? Number(price) : undefined,
      sku: type === "Single" && category !== "Food" ? sku : undefined,
      img: defaultImg,
      images,
      variants:
        variants.length > 0
          ? variants.map((v) => {
              if (category === "Food" && type === "Combo") {
                return {
                  name: v.name,
                  unit: v.unit,
                  quantity: v.quantity,
                  nos: v.nos,
                  sku: v.sku,
                };
              } else {
                return {
                  ...v,
                  mrprice: Number(v.mrprice) || 0,
                  price: Number(v.price) || 0,
                };
              }
            })
          : undefined,
    };

    try {
      if (mode === "add") {
        await axios.post(
          "http://localhost:3000/loggedin/addingproduct",
          payload,
          {
            headers: { Authorization: token },
          }
        );
      } else {
        await axios.put(
          `http://localhost:3000/loggedin/products/${initialData._id}`,
          { editedProduct: payload },
          {
            headers: { Authorization: token },
          }
        );
      }
      onSaved && onSaved();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product.");
    } finally {
      setSaving(false);
      onClose && onClose();
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" aria-modal>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {mode === "add" ? "Add Product" : "Edit Product"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSave}>
              {/* Common fields */}
              <input
                className="form-control mb-2"
                placeholder="Product Name"
                value={productname}
                onChange={(e) => setProductname(e.target.value)}
                required
              />
              <textarea
                className="form-control mb-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <select
                className="form-select mb-2"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Essentials">Essentials</option>
                <option value="Wear">Wear</option>
                <option value="Food">Food</option>
              </select>
              <select
                className="form-select mb-2"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Single">Single</option>
                <option value="Combo">Combo</option>
              </select>

              {/*field for category=essential and type=single */}
              {category === "Essentials" && type === "Single" && (
                <>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="MRP"
                    value={mrprice}
                    onChange={(e) => setMrPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <input
                    className="form-control mb-1"
                    placeholder="SKU"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Default Image URL"
                    value={defaultImg}
                    onChange={(e) => setDefaultImg(e.target.value)}
                  />
                  {/* Images */}
                  <div>
                    {images.map((img, i) => (
                      <div key={i} className="d-flex mb-1 gap-2">
                        <input
                          className="form-control"
                          placeholder="Image URL"
                          value={img}
                          onChange={(e) => updateImage(i, e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeImage(i)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addImage}
                    >
                      + Add Image
                    </button>
                  </div>
                </>
              )}
              {/*field for category=essential and type=Combo */}
              {category === "Essentials" && type === "Combo" &&(
                <>
                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="MRP"
                    value={mrprice}
                    onChange={(e) => setMrPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                  <input
                type="text"
                className="form-control mb-2"
                placeholder="Default Image URL"
                value={defaultImg}
                onChange={(e) => setDefaultImg(e.target.value)}
              />
               {/* Images */}
              <div>
                {images.map((img, i) => (
                  <div key={i} className="d-flex mb-1 gap-2">
                    <input
                      className="form-control"
                      placeholder="Image URL"
                      value={img}
                      onChange={(e) => updateImage(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeImage(i)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addImage}>
                  + Add Image
                </button>
              </div>

{/* Variants */}
              <div className="mt-3">
                <label>Variants</label>
                {variants.map((v, i) => (
                  <div key={i} className="border p-2 mb-2">
                    <input
                      className="form-control mb-1"
                      placeholder="Variant Name"
                      value={v.name}
                      onChange={(e) => updateVariant(i, "name", e.target.value)}
                    />
                    
                    <input
                      type="number"
                      className="form-control mb-1"
                      placeholder="Nos"
                      value={v.nos}
                      onChange={(e) => updateVariant(i, "nos", e.target.value)}
                    />
                    <input
                      className="form-control mb-1"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger mt-1"
                      onClick={() => removeVariant(i)}
                    >
                      Remove Variant
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addVariant}>
                  + Add Variant
                </button>
              </div>
                </>
              )}
              {/*field for category=Food and type=Single  */}
              {category === "Food" && type === "Single" && (
                <>
                <input
                type="text"
                className="form-control mb-2"
                placeholder="Default Image URL"
                value={defaultImg}
                onChange={(e) => setDefaultImg(e.target.value)}
              />
              {/* Variants */}
              <div className="mt-3">
                <label>Variants</label>
                {variants.map((v, i) => (
                  <div key={i} className="border p-2 mb-2">
                    <input
                      className="form-control mb-1"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    />
                    <select
                      className="form-select mb-1"
                      value={v.unit}
                      onChange={(e) => updateVariant(i, "unit", e.target.value)}
                    >
                      <option value="">Unit</option>
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                    </select>
                    <input
                      type="number"
                      className="form-control mb-1"
                      placeholder="Quantity(ml,g)"
                      value={v.quantity}
                      onChange={(e) => updateVariant(i, "quantity", e.target.value)}
                    />
                      <input
                          type="number"
                          className="form-control mb-1"
                          placeholder="MRP"
                          value={v.mrprice === 0 ? "" : v.mrprice}
                          onChange={(e) => updateVariant(i, "mrprice", e.target.value)}
                        />
                        <input
                          type="number"
                          className="form-control mb-1"
                          placeholder="Price"
                          value={v.price === 0 ? "" : v.price}
                          onChange={(e) => updateVariant(i, "price", e.target.value)}
                        />
                         {/* Images */}
              <div>
                {images.map((img, i) => (
                  <div key={i} className="d-flex mb-1 gap-2">
                    <input
                      className="form-control"
                      placeholder="Image URL"
                      value={img}
                      onChange={(e) => updateImage(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeImage(i)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addImage}>
                  + Add Image
                </button>
              </div>
                    <button
                      type="button"
                      className="btn btn-danger mt-1"
                      onClick={() => removeVariant(i)}
                    >
                      Remove Variant
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addVariant}>
                  + Add Variant
                </button>
              </div>
                </>
              )}
              {/*field for category=Food and type=Combo */}
              {category === "Food" && type === "Combo" && (
                <> 
              <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="MRP"
                    value={mrprice}
                    onChange={(e) => setMrPrice(e.target.value)}
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                   <input
                type="text"
                className="form-control mb-2"
                placeholder="Default Image URL"
                value={defaultImg}
                onChange={(e) => setDefaultImg(e.target.value)}
              />
               {/* Images */}
              <div>
                {images.map((img, i) => (
                  <div key={i} className="d-flex mb-1 gap-2">
                    <input
                      className="form-control"
                      placeholder="Image URL"
                      value={img}

                      onChange={(e) => updateImage(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeImage(i)}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addImage}>
                  + Add Image
                </button>
              </div>

              {/* Variants */}
              <div className="mt-3">
                <label>Variants</label>
                {variants.map((v, i) => (
                  <div key={i} className="border p-2 mb-2">
                    <input
                      className="form-control mb-1"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    />
                    <input
                      className="form-control mb-1"
                      placeholder="Variant Name"
                      value={v.name}
                      onChange={(e) => updateVariant(i, "name", e.target.value)}
                    />
                    <select
                      className="form-select mb-1"
                      value={v.unit}
                      onChange={(e) => updateVariant(i, "unit", e.target.value)}
                    >
                      <option value="">Unit</option>
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                    </select>
                    <input
                      type="number"
                      className="form-control mb-1"
                      placeholder="Quantity(ml,g)"
                      value={v.quantity}
                      onChange={(e) => updateVariant(i, "quantity", e.target.value)}
                    />
                     <input
                      type="number"
                      className="form-control mb-1"
                      placeholder="nos"
                      value={v.nos}
                      onChange={(e) => updateVariant(i, "nos", e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-danger mt-1"
                      onClick={() => removeVariant(i)}
                    >
                      Remove Variant
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addVariant}>
                  + Add Variant
                </button>
              </div>
                </>
                
              )}
              {/* wear pending*/}
             { /*{category === "Wear" && type === "Single" &&(
                <>
                <input
                type="text"
                className="form-control mb-2"
                placeholder="Default Image URL"
                value={defaultImg}
                onChange={(e) => setDefaultImg(e.target.value)}
              /><div className="mt-3">
                <label>Variants</label>
                {variants.map((v, i) => (
                 <>
                 <input
                      className="form-control mb-1"
                      placeholder="SKU"
                      value={v.sku}
                      onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    />
                    <input
                      type="number"
                      className="form-control mb-1"
                      placeholder="nos"
                      value={v.nos}
                      onChange={(e) => updateVariant(i, "nos", e.target.value)}
                    />
                 </>       
                ))}
                <button type="button" className="btn btn-secondary" onClick={addVariant}>
                  + Add Variant
                </button>
              </div>

                </>
              )}*/}
              <div className="mt-3 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
