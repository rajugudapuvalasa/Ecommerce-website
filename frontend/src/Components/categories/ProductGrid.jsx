import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductGrid.css";
import Loader from "../Loader/Loader";
import NotFound from "../Loader/NotFound";
import WishlistButton from "../WishlistButton";

const ProductGrid = ({ products, loading }) => {
  const navigate = useNavigate();

  if (loading) return <Loader />;

  if (!products || products.length === 0) return <NotFound />;

  return (
    <div className="category-products">
      {products.map((p) => (
        <div key={p._id} className="category-product-card">
          <img
            src={p.images?.[0]?.url}
            alt={p.name}
            onClick={() => navigate(`/product/${p._id}`)}
          />
          <WishlistButton productId={p._id} />
          <div className="content">
            <h4>{p.name}</h4>
            <p>₹ {p.price}</p>
            <h5>⭐ {p.ratings}</h5>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
