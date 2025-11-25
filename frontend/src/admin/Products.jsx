import React, { useState, useEffect } from "react";
import CreateProduct from "./CreateProduct";
import UpdateProduct from "./UpdateProduct";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  // EDIT STATES
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.log("Error loading products:", error);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await fetch(`http://localhost:5000/api/product/${id}`, {
        method: "DELETE",
      });

      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // OPEN EDIT MODE
  const editProduct = (product) => {
    setEditId(product._id);
    setEditData(product); // store full product data
  };

  // CLOSE EDIT MODE
  const closeEdit = () => {
    setEditId(null);
    setEditData(null);
    loadProducts(); // reload updated products
  };

  return (
    <div className="products-admin-container">
      {/* CREATE PRODUCT POPUP */}
      {showCreate && <CreateProduct onClose={() => setShowCreate(false)} />}

      <h2 className="section-title">All Products</h2>

      {/* PRODUCTS GRID */}
      <div className="all-products">
        {products.map((product) => (
          <div key={product._id} className="product-card">

            {/* IF EDITING THIS PRODUCT → SHOW UPDATE FORM */}
            {editId === product._id ? (
              <UpdateProduct product={editData} onClose={closeEdit} />
            ) : (
              <>
                <div className="product-image-container">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    className="product-image"
                  />
                </div>

                <div className="product-details-container">
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <p>₹ {product.price}</p>

                  <div className="product-icons">
                    <FaEdit
                      onClick={() => editProduct(product)}
                      className="edit-icon"
                      size={20}
                    />

                    <FaTrash
                      onClick={() => deleteProduct(product._id)}
                      className="delete-icon"
                      size={20}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* CREATE BUTTON */}
      <div className="create-button">
        {!showCreate ? (
          <button onClick={() => setShowCreate(true)}>+ Create</button>
        ) : (
          <FaTimes
            className="close-create"
            onClick={() => setShowCreate(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
