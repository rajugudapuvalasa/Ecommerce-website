import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader"
function Product() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.log("Error loading products:", error);
      }
    }

  return (
    <div style={{ padding: "20px" }} >
      {loading && <Loader />}
      <h2>🛒 Latest Products</h2>
      <div 
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`) }
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            {/* Product Image */}
            <img
              src={product.images?.[0]?.url}
              alt={product.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            {/* Product Info */}
            <h3 style={{ margin: "10px 0", color: "var(--body-bg)" }}>{product.name}</h3>
            <p style={{ color: "gray" }}>{product.category}</p>
            <p style={{ fontWeight: "bold", color: "var(--body-bg)" }}>₹ {product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
