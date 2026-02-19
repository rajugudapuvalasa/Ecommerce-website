import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateProduct from "./UpdateProduct";
import "./allproduct.css"
import API_URL from "../../Api";
import { toast } from "react-hot-toast";
import {useNavigate} from "react-router-dom"

const AllProducts = () => {
  const token =localStorage.getItem("token");
  const navigate =useNavigate();
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  if(!token)
  {
    navigate("/login");
  }
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetch(`${API_URL}/products`);
    const data = await res.json();
    setProducts(data.products || []);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;

    const res = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${"token"}`,
      },
    });

    if (res.ok) {
      toast.success("Product deleted");
      loadProducts();
    } else {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="products-admin">
      <h3>All Products</h3>

      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img src={p.images?.[0]?.url} className="table-img" />
              </td>
              <td>{p.name}</td>
              <td>{p.category?.category}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
              <td className="actions">
                <FaEdit onClick={() => setEditProduct(p)} className="edit" />
                <FaTrash onClick={() => deleteProduct(p._id)} className="delete" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editProduct && (
        <UpdateProduct
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={loadProducts}
        />
      )}
    </div>
  );
};

export default AllProducts;
