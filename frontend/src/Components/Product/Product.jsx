import React, { useEffect, useState } from "react";
import "./Product.css"
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader"
import {FaRegHeart } from "react-icons/fa";
import API_URL from "../../Api";
import {toast} from "react-hot-toast"
import WishlistButton from "../WishlistButton";

function Product() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [loading,setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        setProducts(data.products || []);
        setLoading(false);
      } catch (error) {
        console.log("Error loading products:", error);
      }
    }

  return (
    <div className="product-page" >
      {loading && <Loader />}
      <div className="product-structure">        
          {products.map((product) => (
            <div className="product"
              key={product._id}>                       
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  onClick={() => navigate(`/product/${product._id}`) }
                />
            <WishlistButton productId={product._id} />
            <div className="content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
                <p className="Product-rating">⭐ {product.ratings}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
